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
        $data = $this->getRequestData();
        $email = $data['email'];
        $password = $data['wachtwoord'];
        
        if (isset($email) && isset($password)) {
            $messages = '';
            $uAccount = $this->registerAccount($email, $password, $messages);
            $this->response->setJsonContent(array('messages' => $messages, 'account' => $uAccount));
        }
    }
    
    private function registerAccount($email, $password, &$messages) {
        $messages = '';
        $uAccount = null;

        $accountLevel = AccountLevel::findFirst(array('level' => 'user'));
		
        $account = new Account();
        $account->email = $email;
        $account->wachtwoord = $password;
        $account->accountlevel_id = $accountLevel->accountlevel_id;
		$account->salt = $this->createSalt();
		
        if($account->save()) {
            $user = new Gebruiker();
            if($user->save()) {
                $userId = $user->gebruiker_id;
                $accountId = $account->account_id;
                
                $accountUser = new AccountGebruikerLink();
                $accountUser->account_id = $accountId;
                $accountUser->gebruiker_id = $userId;
                if($accountUser->save()) {
                    $uAccount = $this->loginAccount($email, $password, $messages);
                } else {
                    $messages = $this->checkErrors($accountUser);
                }
            }  else {
                $messages = $this->checkErrors($user);
            }
        } else {
            $messages = $this->checkErrors($account);
        }
        return $uAccount;
    }
    
    public function login() {
        $email = $this->request->getQuery('email');
        $password = $this->request->getQuery('wachtwoord');
        
        $messages = '';
        
        $account = $this->loginAccount($email, $password, $messages);
        
        $this->response->setJsonContent(array('messages' => $messages, 'account' => $account));
    }

    public function loginFacebook() {
        $fid = $this->request->getQuery('fid');
        $f_email = $this->request->getQuery('femail');
        
        if(isset($fid) && isset($f_email)) {
            $messages = '';
            $tmpAccount = Account::findFirst(array('facebook_id' => $fid));
            
            if($tmpAccount) {
                $account = $this->loginAccount($tmpAccount->email, $tmpAccount->password, $messages);
                $this->response->setJsonContent(array('messages' => $messages, 'account' => $account));
            } else {
                $account = $this->registerAccount($f_email, hash('md5', time() . uniqid() . "random"), $messages);
                if($messages === '') {
                    $account->facebook_id = $fid;
                    if(!$account->save()) {
                        $messages = $this->checkErrors($account);
                    }
                }
                $this->response->setJsonContent(array('messages' => $messages, 'account' => $account));
            }
            
        } else {
            $this->response->setStatusCode(400, "Bad value given");
        }
    }
    
    private function loginAccount($email, $password, &$messages, $token = null) {
        // login logic
        // Klopt niet, je moet findFirst waar email = email AND password = password
        $account = Account::findFirst(array(
            'conditions' => 'email = :email: AND wachtwoord = :wachtwoord:',
            'bind' => array('email' => $email, 'wachtwoord' => $password),
        ));
		
        if ($account) {
            if(!isset($token))
                $token = hash('md5', time() . uniqid() . $account->account_id);
            
            $account->token = $token;
            if ($account->save()) {
                //$this->response->setJsonContent(array('token' => $token));
                unset($account->wachtwoord);
                unset($account->validated);
                $account->gebruiker = $account->Gebruiker[0];
                if(isset($account->gebruiker->postcode_id) && $account->gebruiker->postcode_id > 0)
                    $account->gebruiker->postcode = Postcode::findFirst($account->gebruiker->postcode_id);
            } else {
                $messages = $this->checkErrors($account);
                $token = null;
            }
        } else {
            $this->response->setStatusCode(404, "Account not found");
            return null;
        }
		
        return $account;
    }
	
	private function createSalt()
	{
		var $salt = uniqid(mt_rand(), true);
		
		return $salt;
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
