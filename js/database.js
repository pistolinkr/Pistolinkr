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

// 전역 인스턴스 생성
window.dbAPI = new DatabaseAPI();
window.blobAPI = new BlobAPI();

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