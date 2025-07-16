import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // 프로젝트 설정 테이블 생성
      await sql`
        CREATE TABLE IF NOT EXISTS project_settings (
          id SERIAL PRIMARY KEY,
          project_name VARCHAR(255) NOT NULL UNIQUE,
          url VARCHAR(500) NOT NULL,
          description TEXT,
          status VARCHAR(50) DEFAULT 'active',
          hidden_for_user BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // 모든 프로젝트 설정 조회
      const result = await sql`SELECT * FROM project_settings ORDER BY updated_at DESC`;
      
      res.status(200).json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Project settings fetch error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch project settings'
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { project_name, url, description, status, hidden_for_user } = req.body;
      
      // 기존 설정이 있는지 확인
      const existing = await sql`
        SELECT id FROM project_settings WHERE project_name = ${project_name}
      `;
      
      let result;
      if (existing.rows.length > 0) {
        // 기존 설정 업데이트
        result = await sql`
          UPDATE project_settings 
          SET url = ${url}, description = ${description}, status = ${status}, 
              hidden_for_user = ${hidden_for_user}, updated_at = CURRENT_TIMESTAMP
          WHERE project_name = ${project_name}
          RETURNING *;
        `;
      } else {
        // 새 설정 추가
        result = await sql`
          INSERT INTO project_settings (project_name, url, description, status, hidden_for_user)
          VALUES (${project_name}, ${url}, ${description}, ${status}, ${hidden_for_user})
          RETURNING *;
        `;
      }
      
      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Project settings save error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to save project settings'
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { project_name } = req.query;
      
      await sql`DELETE FROM project_settings WHERE project_name = ${project_name}`;
      
      res.status(200).json({
        success: true,
        message: 'Project settings deleted successfully'
      });
    } catch (error) {
      console.error('Project settings delete error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete project settings'
      });
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
} 