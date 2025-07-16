import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // 테이블이 없으면 생성
      await sql`
        CREATE TABLE IF NOT EXISTS dashboard_data (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT,
          url VARCHAR(500),
          category VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // 모든 데이터 조회
      const result = await sql`SELECT * FROM dashboard_data ORDER BY created_at DESC`;
      
      res.status(200).json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({
        success: false,
        error: 'Database connection failed'
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, content, url, category } = req.body;
      
      const result = await sql`
        INSERT INTO dashboard_data (title, content, url, category)
        VALUES (${title}, ${content}, ${url}, ${category})
        RETURNING *;
      `;
      
      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Insert error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to insert data'
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, title, content, url, category } = req.body;
      
      const result = await sql`
        UPDATE dashboard_data 
        SET title = ${title}, content = ${content}, url = ${url}, 
            category = ${category}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *;
      `;
      
      res.status(200).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update data'
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      
      await sql`DELETE FROM dashboard_data WHERE id = ${id}`;
      
      res.status(200).json({
        success: true,
        message: 'Data deleted successfully'
      });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete data'
      });
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
} 