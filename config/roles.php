<?php

return array(
    'guest' => array(
        'rights' => array(
            'Provider' => array('get','post','put'),
            'Account' => array('get'),
        ),
        'isAdmin' => false
    ),
    'user' => array(
        'rights' => array(
            'Account' => array('login', 'logout', 'register'),
            'User' => array('put', 'get'),
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
            
        ),
        'inheritRights' => 'user',
        'isAdmin' => false
    )
);

?>
