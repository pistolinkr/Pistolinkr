import { get } from '@vercel/edge-config';

// Edge Config ID 확인
const edgeConfigId = process.env.EDGE_CONFIG_ID;

// 환경 변수 확인
if (!edgeConfigId) {
  console.error('Missing Edge Config ID environment variable');
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Edge Config에서 프로젝트 설정 조회
      const projectSettings = await get('projectSettings');
      
      res.status(200).json({
        success: true,
        data: projectSettings || []
      });
    } catch (error) {
      console.error('Edge Config fetch error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch project settings from Edge Config',
        details: error.message
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { project_name, url, description, status, hidden_for_user } = req.body;
      
      // Edge Config는 읽기 전용이므로, 여기서는 현재 설정을 반환
      // 실제 업데이트는 Vercel 대시보드에서 수동으로 해야 합니다
      const currentSettings = await get('projectSettings') || [];
      
      // 기존 설정 찾기
      const existingIndex = currentSettings.findIndex(setting => setting.project_name === project_name);
      
      const newSetting = {
        project_name,
        url,
        description,
        status,
        hidden_for_user,
        updated_at: new Date().toISOString()
      };
      
      if (existingIndex >= 0) {
        // 기존 설정 업데이트
        currentSettings[existingIndex] = newSetting;
      } else {
        // 새 설정 추가
        currentSettings.push(newSetting);
      }
      
      res.status(200).json({
        success: true,
        data: newSetting,
        message: 'Settings updated in Edge Config. Please update manually in Vercel dashboard.',
        currentSettings: currentSettings
      });
    } catch (error) {
      console.error('Edge Config update error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update project settings in Edge Config',
        details: error.message
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { project_name } = req.query;
      
      const currentSettings = await get('projectSettings') || [];
      const updatedSettings = currentSettings.filter(setting => setting.project_name !== project_name);
      
      res.status(200).json({
        success: true,
        message: 'Project settings removed from Edge Config. Please update manually in Vercel dashboard.',
        currentSettings: updatedSettings
      });
    } catch (error) {
      console.error('Edge Config delete error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete project settings from Edge Config',
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