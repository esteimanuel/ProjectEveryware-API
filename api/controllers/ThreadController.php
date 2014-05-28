<?php 

class ThreadController extends BaseController {

	public function getThreadForActie() {
		$actie_id = $this->request->getQuery('id');
	   		
		if(isset($actie_id) && $actie_id > 0) {
			
			$threads = Thread::find(
				array(
					'conditions' => 'actie_id = :aid:',
					'bind' => array('aid' => $actie_id),
				)	
			);
					
			$rThreads = array();
			
			foreach($threads as $key => $thread)
			{
				$aPosts = array();
				
				foreach($thread->Post as $tsop => $post) {
				
					$aPosts[] = $post;
				}
				
				$thread->post = $aPosts;
				array_push($rThreads, $thread);
			}			
		
			$this->response->setJsonContent($rThreads);
        } 
		else {
            $this->response->setStatusCode(400, 'Bad value given');
        }
	}

}
?>