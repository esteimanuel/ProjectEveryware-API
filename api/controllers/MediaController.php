<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of MediaController
 *
 * @author Remi
 */
class MediaController extends BaseController {
    //put your code here
    
    private $_mediaPath = '../_media/';
    
    private $_imagePath = '../_media/images/';
    private $_realImagePath = '/api/_media/images/';
    
    private $_videoPath = '../_media/videos/';
    private $_realVideoPath = '/api/_media/images/';
    
    private $_imageExtensions = array(
        'jpg', 'jpeg', 'png'
    );
    private $_videoExtenstions = array(
        'mp4'
    );
    
//    public function get() {
//        
//    }
//    
    public function postImages() {
        $this->uploadFile('image');
    }
    
    public function postVideos() {
        $this->uploadFile('video');
    }
    
    private function uploadFile($type) {
        //Check if the user has uploaded files
        if ($this->request->hasFiles() == true) {
            $messages = array();
            $media = array();
            //Print the real file names and their sizes
            foreach ($this->request->getUploadedFiles() as $file){
//                echo $file->getName(), " ", $file->getSize(), "\n";
                if(in_array(strtolower($file->getExtension()), (($type == 'image') ? $this->_imageExtensions : $this->_videoExtenstions))) {
                    if(!$file->moveTo((($type == 'image') ? $this->_imagePath : $this->_videoPath))) {
                        $messages[] = 'Failed to save file "'.$file->getName().'"';
                    } else {
                        // In correct location
                        $med = new Media();
                        $med->type = $type;
                        $med->url = 'http://' . $_SERVER['SERVER_NAME'] . (($type == 'image') ? $this->_realImagePath : $this->_realVideoPath). $file->getName();
                        if(!$med->create()) {
                            // Failed to save media to database
                            $messages[] = $this->checkErrors($med);
                        } else {
                            // Saved to db
                            $media[] = $med;
                        }
                    }
                } else {
//                    $this->response->setStatusCode(400, 'Invalid file given');
                    $messages[] = 'Invalid file extension for file "'.$file->getName().'"';
                }
            }
            if(!empty($messages)) {
                $this->response->setStatusCode(400, 'Bad Request');
            }
            $this->response->setJsonContent(array('messages' => $messages, 'media' => $media));
        } else {
            $this->response->setStatusCode(404, 'No Files Found');
        }
    }
    
}

?>
