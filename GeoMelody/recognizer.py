class ACRCloudRecognizer:
    def recognize_by_file(self, file_path, start_seconds, rec_length=10):
      #@param file_path : query file path
      #@param start_seconds : skip (start_seconds) seconds from from the beginning of (filePath)
      #@param rec_length: use rec_length seconds data to recongize
      #@return result metainfos
      
    def recognize_by_filebuffer(self, file_buffer, start_seconds, rec_length=10):
      #@param file_buffer : file_path query buffer
      #@param start_seconds : skip (start_seconds) seconds from from the beginning of (filePath)
      #@param rec_length: use rec_length seconds data to recongize
      #@return result metainfos
      
    def recognize(self, wav_audio_buffer):
      #@param wav_audio_buffer : query buffer(RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 8000 Hz)
      #@return result metainfos
