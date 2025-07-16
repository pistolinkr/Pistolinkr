import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 생성
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // 프로젝트 설정 테이블 생성 (Supabase에서는 수동으로 생성해야 함)
      // 테이블이 없다면 에러가 발생할 수 있으므로 try-catch로 처리
      
      // 모든 프로젝트 설정 조회
      const { data, error } = await supabase
        .from('project_settings')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) {
        // 테이블이 없는 경우 에러 메시지와 함께 빈 배열 반환
        if (error.code === '42P01') { // 테이블이 존재하지 않는 경우
          console.log('project_settings table does not exist. Please run the SQL script in Supabase SQL editor.');
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
      console.error('Project settings fetch error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch project settings',
        details: error.message
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { project_name, url, description, status, hidden_for_user } = req.body;
      
      // 기존 설정이 있는지 확인
      const { data: existing } = await supabase
        .from('project_settings')
        .select('id')
        .eq('project_name', project_name)
        .single();
      
      let result;
      if (existing) {
        // 기존 설정 업데이트
        const { data, error } = await supabase
          .from('project_settings')
          .update({
            url,
            description,
            status,
            hidden_for_user,
            updated_at: new Date().toISOString()
          })
          .eq('project_name', project_name)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // 새 설정 추가
        const { data, error } = await supabase
          .from('project_settings')
          .insert({
            project_name,
            url,
            description,
            status,
            hidden_for_user
          })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Project settings save error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to save project settings',
        details: error.message
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { project_name } = req.query;
      
      const { error } = await supabase
        .from('project_settings')
        .delete()
        .eq('project_name', project_name);
      
      if (error) throw error;
      
      res.status(200).json({
        success: true,
        message: 'Project settings deleted successfully'
      });
    } catch (error) {
      console.error('Project settings delete error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete project settings',
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