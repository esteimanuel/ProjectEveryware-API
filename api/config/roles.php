<?php

return array(
    'guest' => array(
        'rights' => array(
            'Provider' => array('get','post','put'),
            'Account' => array('get', 'register', 'login', 'logout'),
            'Gebruiker' => array('get'),
            'AccountLevel' => array('get', 'post'),
            'Actie' => array('get'),
            'Wijk' => array('get'),
            'Faq' => array('get'),
        ),
        'isAdmin' => true
    ),
    'user' => array(
        'rights' => array(
            'Account' => array('login', 'logout', 'register'),
            'Gebruiker' => array('put', 'get'),
            'Buddy' => array('post', 'put'),
        ),
        'isAdmin' => false
    ),
    'admin' => array(
        'rights' => array(
            
        ),
        'isAdmin' => true
    ),
    'buddy' => array(
        'rights' => array(
            'Buddy' => array('put'),
        ),
        'inheritRights' => 'user',
        'isAdmin' => false
    )
);

?>
