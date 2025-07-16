import { createClient } from '@supabase/supabase-js';
import config from '../js/config.js';

// Supabase 클라이언트 생성 - 설정 유틸리티 사용
const supabaseUrl = config.getSupabaseUrl();
const supabaseServiceKey = config.getSupabaseServiceKey();

// 환경 변수 확인
const validation = config.validateConfig();
if (!validation.isValid) {
  console.error('Configuration validation failed:', validation.errors);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // 모든 데이터 조회
      const { data, error } = await supabase
        .from('dashboard_data')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        // 테이블이 없는 경우 빈 배열 반환
        if (error.code === '42P01') {
          res.status(200).json({
            success: true,
            data: [],
            message: 'Table does not exist. Please create the table first.'
          });
          return;
        }
        throw error;
      }
      
      res.status(200).json({
        success: true,
        data: data || []
      });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({
        success: false,
        error: 'Database connection failed',
        details: error.message
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, content, url, category } = req.body;
      
      const { data, error } = await supabase
        .from('dashboard_data')
        .insert({
          title,
          content,
          url,
          category
        })
        .select();
      
      if (error) {
        console.error('Insert error details:', error);
        throw error;
      }
      
      res.status(201).json({
        success: true,
        data: data[0] // 첫 번째 결과 사용
      });
    } catch (error) {
      console.error('Insert error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to insert data',
        details: error.message
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, title, content, url, category } = req.body;
      
      const { data, error } = await supabase
        .from('dashboard_data')
        .update({
          title,
          content,
          url,
          category,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      res.status(200).json({
        success: true,
        data: data
      });
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update data',
        details: error.message
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      
      const { error } = await supabase
        .from('dashboard_data')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      res.status(200).json({
        success: true,
        message: 'Data deleted successfully'
      });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete data',
        details: error.message
      });
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
} 