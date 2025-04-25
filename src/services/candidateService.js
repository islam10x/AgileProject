// src/services/candidateService.js
import supabase from './supabase'; // Adjust the import path to where your supabase.js file is located

/**
 * Service for managing candidates in Supabase
 */
export const candidateService = {
  /**
   * Upload resume file to Supabase storage
   * @param {File} file - The resume file to upload
   * @param {string} firstName - Candidate's first name
   * @param {string} lastName - Candidate's last name
   * @returns {Promise<string|null>} - The path to the uploaded file or null if failed
   */
  async uploadResume(file, firstName, lastName) {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${firstName}-${lastName}.${fileExt}`;
    
    try {
      const { data, error } = await supabase.storage
        .from('cv')
        .upload(fileName, file);
        
      if (error) {
        throw error;
      }
      
      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('cv')
        .getPublicUrl(data.path);
        
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  },
  
  /**
   * Create a new candidate record in the database
   * @param {Object} candidateData - The candidate data to insert
   * @returns {Promise<Object>} - The result of the operation
   */
  async createCandidate(candidateData) {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .insert([candidateData])
        .select();
        
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error creating candidate:', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get a candidate by ID
   * @param {string} id - The candidate ID
   * @returns {Promise<Object>} - The candidate data
   */
  async getCandidateById(id) {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching candidate:', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get all candidates
   * @param {Object} options - Query options (limit, orderBy, etc.)
   * @returns {Promise<Object>} - The candidates data
   */
  async getAllCandidates(options = {}) {
    try {
      const { limit = 100, orderBy = 'created_at', ascending = false } = options;
      
      let query = supabase
        .from('candidates')
        .select('*')
        .order(orderBy, { ascending });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching candidates:', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Update a candidate's status or information
   * @param {string} id - The candidate ID
   * @param {Object} updates - The fields to update
   * @returns {Promise<Object>} - The result of the operation
   */
  async updateCandidate(id, updates) {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .update(updates)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error updating candidate:', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Delete a candidate
   * @param {string} id - The candidate ID
   * @returns {Promise<Object>} - The result of the operation
   */
  async deleteCandidate(id) {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting candidate:', error);
      return { success: false, error: error.message };
    }
  }
};

export default candidateService;