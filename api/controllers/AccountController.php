<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AccountController
 *
 * @author Remi
 */
class AccountController extends BaseController {

	public function register() {
		$messages = '';
        $id = 0;
		// Create new user
		$user = new User();
		if ($user->save()) {
			$accountPost = $this->request->getPost();
			// Create new account
			$account = new Account();
			foreach($accountPost as $key => $value) {
				$account->$key = $value;
			}
			$account->gebruiker_id = $user->gebruiker_id;
			if ($account->save()) {
					$this->response->setJsonContent(array('account_email' => $account->email, 'gebruiker_id' => $account->gebruiker_id));
				} else {
		            $messages = $this->checkErrors($account);
	            	$id = -1;
			}
		} else {
            $messages = $this->checkErrors($user);
        	$id = -1;
		}

        $this->response->setJsonContent(array('messages' => $messages, 'id' => $id));
	}

	public function login() {
		$messages = '';

		$email = $this->request->getPost("email");
		$password = $this->request->getPost("password");
                // Klopt niet, je moet findFirst waar email = email AND password = password
		$account = Account::findFirst($email);
		$compare = strcmp($account->wachtwoord, $password);
		if ($compare === 0) {
			$token = hash('md5', time() . uniqid() . $account->email);
			$account->token = $token;
			if ($account->save()) {
				$this->response->setJsonContent(array('token' => $token));
			} else {
				$messages = $this->checkErrors($account);
			}
		} else {
			$messages = $this->checkErrors($compare);
		}
                
                // Dit override de eerste setJsonContent, je geeft dus geen token mee
		$this->response->setJsonContent(array('messages' => $messages));
	}

	// public function logout() {
	// 	$messages = '';

	// 	$token = $this->request->getPost("token");

	// 	$account = Account::findFirst("token = '".$token."'");
	// 	if ($account) {
	// 		$account->token = '';
	// 		if ($account->save()) {
	// 			//$this->response->setJsonContent(array('messages' => 'success'));
	// 		} else {
	// 			$messages = $this->checkErrors($account);
	// 		}
	// 	} else {
	// 		$messages = "account with given token not found";
	// 	}

	// 	$this->response->setJsonContent(array('messages' => $messages));
	// }
}

?>
