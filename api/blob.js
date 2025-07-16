import { put, del, list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { filename, content, access = 'public' } = req.body;
      
      const { url } = await put(filename, content, { access });
      
      res.status(201).json({
        success: true,
        url: url
      });
    } catch (error) {
      console.error('Blob upload error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload file'
      });
    }
  } else if (req.method === 'GET') {
    try {
      const { prefix } = req.query;
      
      const { blobs } = await list({ prefix });
      
      res.status(200).json({
        success: true,
        blobs: blobs
      });
    } catch (error) {
      console.error('Blob list error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to list files'
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { url } = req.body;
      
      await del(url);
      
      res.status(200).json({
        success: true,
        message: 'File deleted successfully'
      });
    } catch (error) {
      console.error('Blob delete error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete file'
      });
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
} 