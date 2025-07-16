// 데이터베이스 API 유틸리티
class DatabaseAPI {
  constructor() {
    this.baseURL = '/api';
  }

  // 데이터 조회
  async getData() {
    try {
      const response = await fetch(`${this.baseURL}/db`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw error;
    }
  }

  // 데이터 추가
  async addData(data) {
    try {
      const response = await fetch(`${this.baseURL}/db`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to add data:', error);
      throw error;
    }
  }

  // 데이터 수정
  async updateData(id, data) {
    try {
      const response = await fetch(`${this.baseURL}/db`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...data })
      });
      
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to update data:', error);
      throw error;
    }
  }

  // 데이터 삭제
  async deleteData(id) {
    try {
      const response = await fetch(`${this.baseURL}/db?id=${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        return result.message;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to delete data:', error);
      throw error;
    }
  }
}

// Blob 저장소 API 유틸리티
class BlobAPI {
  constructor() {
    this.baseURL = '/api/blob';
  }

  // 파일 업로드
  async uploadFile(filename, content, access = 'public') {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename, content, access })
      });
      
      const result = await response.json();
      
      if (result.success) {
        return result.url;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  }

  // 파일 목록 조회
  async listFiles(prefix = '') {
    try {
      const response = await fetch(`${this.baseURL}?prefix=${prefix}`);
      const result = await response.json();
      
      if (result.success) {
        return result.blobs;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to list files:', error);
      throw error;
    }
  }

  // 파일 삭제
  async deleteFile(url) {
    try {
      const response = await fetch(this.baseURL, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });
      
      const result = await response.json();
      
      if (result.success) {
        return result.message;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  }
}

// 프로젝트 설정 API 유틸리티 (Postgres)
class ProjectSettingsAPI {
  constructor() {
    this.baseURL = '/api/project-settings';
  }

  // 프로젝트 설정 조회
  async getProjectSettings() {
    try {
      const response = await fetch(this.baseURL);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to fetch project settings:', error);
      throw error;
    }
  }

  // 프로젝트 설정 저장/업데이트
  async saveProjectSettings(projectName, settings) {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_name: projectName,
          url: settings.url,
          description: settings.description,
          status: settings.status,
          hidden_for_user: settings.hiddenForUser
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to save project settings:', error);
      throw error;
    }
  }

  // 프로젝트 설정 삭제
  async deleteProjectSettings(projectName) {
    try {
      const response = await fetch(`${this.baseURL}?project_name=${encodeURIComponent(projectName)}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        return result.message;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to delete project settings:', error);
      throw error;
    }
  }
}

// Edge Config API 유틸리티
class EdgeConfigAPI {
  constructor() {
    this.baseURL = '/api/edge-config';
  }

  // 프로젝트 설정 조회
  async getProjectSettings() {
    try {
      const response = await fetch(this.baseURL);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to fetch project settings from Edge Config:', error);
      throw error;
    }
  }

  // 프로젝트 설정 저장/업데이트
  async saveProjectSettings(projectName, settings) {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_name: projectName,
          url: settings.url,
          description: settings.description,
          status: settings.status,
          hidden_for_user: settings.hiddenForUser
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to save project settings to Edge Config:', error);
      throw error;
    }
  }

  // 프로젝트 설정 삭제
  async deleteProjectSettings(projectName) {
    try {
      const response = await fetch(`${this.baseURL}?project_name=${encodeURIComponent(projectName)}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        return result.message;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to delete project settings from Edge Config:', error);
      throw error;
    }
  }
}

// 전역 인스턴스 생성
window.dbAPI = new DatabaseAPI();
window.blobAPI = new BlobAPI();
window.projectSettingsAPI = new ProjectSettingsAPI();
window.edgeConfigAPI = new EdgeConfigAPI();

// 사용 예시 함수들
window.databaseUtils = {
  // 대시보드 데이터 로드
  async loadDashboardData() {
    try {
      const data = await window.dbAPI.getData();
      console.log('Dashboard data loaded:', data);
      return data;
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      return [];
    }
  },

  // 새 항목 추가
  async addDashboardItem(title, content, url, category) {
    try {
      const newItem = await window.dbAPI.addData({
        title,
        content,
        url,
        category
      });
      console.log('New item added:', newItem);
      return newItem;
    } catch (error) {
      console.error('Failed to add item:', error);
      throw error;
    }
  },

  // 프로젝트 설정 로드 (Postgres)
  async loadProjectSettings() {
    try {
      const settings = await window.projectSettingsAPI.getProjectSettings();
      console.log('Project settings loaded:', settings);
      return settings;
    } catch (error) {
      console.error('Failed to load project settings:', error);
      return [];
    }
  },

  // 프로젝트 설정 저장 (Postgres)
  async saveProjectSettings(projectName, settings) {
    try {
      const result = await window.projectSettingsAPI.saveProjectSettings(projectName, settings);
      console.log('Project settings saved:', result);
      return result;
    } catch (error) {
      console.error('Failed to save project settings:', error);
      throw error;
    }
  },

  // 프로젝트 설정 로드 (Edge Config)
  async loadProjectSettingsFromEdgeConfig() {
    try {
      const settings = await window.edgeConfigAPI.getProjectSettings();
      console.log('Project settings loaded from Edge Config:', settings);
      return settings;
    } catch (error) {
      console.error('Failed to load project settings from Edge Config:', error);
      return [];
    }
  },

  // 파일 업로드
  async uploadDashboardFile(filename, content) {
    try {
      const url = await window.blobAPI.uploadFile(filename, content);
      console.log('File uploaded:', url);
      return url;
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  }
}; 