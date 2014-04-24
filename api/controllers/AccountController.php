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
        $token = null;
        
        $email = $this->request->getPost('email');
        $password = $this->request->getPost('password');
        
        $account = new Account();
        $account->email = $email;
        $account->password = $password;
        if($account->save()) {
            $user = new User();
            if($user->save()) {
                $userId = $user->gebruiker_id;
                $accountId = $account->account_id;
                
                $accountUser = new AccountGebruiker();
                $accountUser->acount_id = $accountId;
                $accountUser->user_id = $userId;
                if($accountUser->save()) {
                    $token = $this->loginAccount($email, $password);
                } else {
                    $messages = $this->checkErrors($user);
                }
            }  else {
                $messages = $this->checkErrors($user);
            }
        } else {
            $messages = $this->checkErrors($user);
        }

        $this->response->setJsonContent(array('messages' => $messages, 'token' => $token));
    }
    
    public function login() {
        $email = $this->request->getQuery('email');
        $password = $this->request->getQuery('password');
        
        $messages = '';
        
        $token =  $this->loginAccount($email, $password);
        
        $this->response->setJsonContent(array('messages' => $messages, 'token' => $token));
    }
    
    private function loginAccount($email, $password, $token = null) {
        // login logic
        // Klopt niet, je moet findFirst waar email = email AND password = password
        $account = Account::findFirst(array(
            'condition' => 'email = :email: AND password = :password:',
            'bind' => array('email' => $email, 'password' => $password),
        ));
        
        if ($account) {
            if(!isset($token))
                $token = hash('md5', time() . uniqid() . $account->account_id);
            
            $account->token = $token;
            if ($account->save()) {
                $this->response->setJsonContent(array('token' => $token));
            } else {
                $messages = $this->checkErrors($account);
                $token = null;
            }
        } else {
            $this->response->setStatusCode(404);
            return null;
        }
        
        return $token;
    }
    
//	public function register() {
//		$messages = '';
//        $id = 0;
//		// Create new user
//		$user = new User();
//		if ($user->save()) {
//			$accountPost = $this->request->getPost();
//			// Create new account
//			$account = new Account();
//			foreach($accountPost as $key => $value) {
//				$account->$key = $value;
//			}
//			$account->gebruiker_id = $user->gebruiker_id;
//			if ($account->save()) {
//					$this->response->setJsonContent(array('account_email' => $account->email, 'gebruiker_id' => $account->gebruiker_id));
//				} else {
//		            $messages = $this->checkErrors($account);
//	            	$id = -1;
//			}
//		} else {
//            $messages = $this->checkErrors($user);
//        	$id = -1;
//		}
//
//        $this->response->setJsonContent(array('messages' => $messages, 'id' => $id));
//	}
//
//	public function login() {
//		$messages = '';
//
//		$email = $this->request->getPost("email");
//		$password = $this->request->getPost("password");
//                // Klopt niet, je moet findFirst waar email = email AND password = password
//		$account = Account::findFirst($email);
//		$compare = strcmp($account->wachtwoord, $password);
//		if ($compare === 0) {
//			$token = hash('md5', time() . uniqid() . $account->email);
//			$account->token = $token;
//			if ($account->save()) {
//				$this->response->setJsonContent(array('token' => $token));
//			} else {
//				$messages = $this->checkErrors($account);
//			}
//		} else {
//			$messages = $this->checkErrors($compare);
//		}
//                
//                // Dit override de eerste setJsonContent, je geeft dus geen token mee
//		$this->response->setJsonContent(array('messages' => $messages));
//	}

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
