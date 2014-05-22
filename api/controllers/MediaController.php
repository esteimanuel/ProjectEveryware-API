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
    
    private $_mediaPath = '../media/';
    private $_imagePath = '../media/images/';
    private $_realImagePath = '/api/media/images/';
    
    private $_imageExtensions = array(
        'jpg', 'jpeg', 'png'
    );
    
//    public function get() {
//        
//    }
//    
    public function postImages() {
        
        //Check if the user has uploaded files
        if ($this->request->hasFiles() == true) {
            $messages = array();
            $media = array();
            //Print the real file names and their sizes
            foreach ($this->request->getUploadedFiles() as $file){
//                echo $file->getName(), " ", $file->getSize(), "\n";
                if(in_array(strtolower($file->getExtension()), $this->_imageExtensions)) {
                    if(!$file->moveTo($this->_imagePath)) {
                        $messages[] = 'Failed to save file "'.$file->getName().'"';
                    } else {
                        // In correct location
                        $med = new Media();
                        $med->type = 'image';
                        $med->url = 'http://' . $_SERVER['SERVER_NAME'] . $this->_realImagePath. $file->getName();
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
