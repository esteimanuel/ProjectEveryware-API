<?php

if (!defined('hasMany'))
{

    define('hasMany', 'hasMany');         //Defines a 1-n relationship, 'key' => 'tableKey (id)', 'f_table' => 'foreign_table', 'f_key' => 'foreign_key (table_id)'
    define('hasOne', 'hasOne');          //Defines a 1-1 relationship, 'key' => 'tableKey (id)', 'f_table' => 'foreign_table', 'f_key' => 'foreign_key (table_id)'
    define('belongsTo', 'belongsTo');       //Defines a n-1 relationship, 'f_key' => 'foreign_key (f_table_id)', => 'f_table' => 'foreign_table', 'key' => 'tableKey (id)'
    define('hasManyToMany', 'hasManyToMany');   //Defines a n-n relationship, 'key' => 'id', 'k_table' => 'koppel_table', 'k_key1' => 'kt_key1_id', 'k_key2' => 'kt_key1_id', 'f_table' => 'foreign_table', 'f_key' => 'ftable_id'),

    define('props', 'properties');
    define('relations', 'relations');
    define('settings', 'settings');
}

$config = include 'config.php';

return array(
    'models' => array(
        'gebruiker' => array(
            settings => array(
                't_name' => 'gebruiker'
            ),
            props => array(
                'gebruiker_id',
                'borg_betaald',
                'huisnummer',
                'huisnummer_toevoeging',
                'voornaam',
                'tussenvoegsel',
                'achternaam',
                'telefoonnummer',
                'geboorte_datum',
                'shared_info',
                'actie_id',
                'postcode_id',
                'pakket_id',
                'status_id',
            ),
            relations => array(
                array('type' => belongsTo, 'f_table' => 'actie', 'key' => 'gebruiker_id'),
                array('type' => belongsTo, 'f_table' => 'postcode'),
                array('type' => belongsTo, 'f_table' => 'providerpakket'),
                array('type' => hasOne, 'f_table' => 'interesse'),
                array('type' => hasOne, 'key' => 'gebruiker_id', 'f_table' => 'buddy', 'f_key' => 'gebruiker_id'),
                array('type' => hasManyToMany, 'key' => 'gebruiker_id', 'k_table' => 'accountGebruikerLink', 'k_key1' => 'gebruiker_id', 'f_table' => 'account'),
                array('type' => hasMany, 'key' => 'gebruiker_id', 'f_table' => 'media'),
                array('type' => hasOne, 'f_table' => 'statuslist'),
            )
        ),
        'actie' => array(
            settings => array(
                't_name' => 'actie'
            ),
            props => array(
                'actie_id',
                'borg',
                'borg_totaal',
                'initiatiefnemer_id',
                'eind_datum' => array(
                    'validation' => array('presenceOf')
                ),
                'start_datum' => array(
                    'validation' => array('presenceOf')
                ),
                'wijk_id' => array(
                    'validation' => array('presenceOf')
                ),
                'statuslist_id' => array(
                    'validation' => array('presenceOf')
                ),
                'naam',
            ),
            relations => array(
                array('type' => hasMany, 'f_table' => 'gebruiker'),
                array('type' => hasMany, 'f_table' => 'media'),
                array('type' => belongsTo, 'f_table' => 'wijk'),
                array('type' => hasOne, 'f_table' => 'statuslist'),
                //array('type' => hasOne, 'f_table' => 'status'),
                array('type' => hasManyToMany, 'key' => 'id', 'k_table' => 'actieproviderlink', 'k_key1' => 'actie_id', 'k_key2' => 'provider_id', 'f_table' => 'provider', 'f_key' => 'id'),
            )
        ),
        'wijk' => array(
            settings => array(
                't_name' => 'wijk'
            ),
            props => array(
                'wijk_id',
                'target',
                'actie_duur_dagen',
                'beschikbaar' => array(
                    'validation' => array('presenceOf'),
                    'default' => false,
                ),
                'aantal_huishoudens',
                'wijk_naam',
            ),
            relations => array(
                array('type' => hasMany, 'f_table' => 'postcode'),
                array('type' => hasMany, 'f_table' => 'actie'),
            )
        ),
        'postcode' => array(
            settings => array(
                't_name' => 'postcode'
            ),
            props => array(
                'postcode_id',
                'plaats',
                'gemeente',
//			'wijkcode' => array(
//				'validation' => array('presenceOf', 'regex' => array('pattern' => '^[1-9][0-9]{3}\s')),
//			),
//                        'lettercombinatie' => array(
//                            'validation' => array('regex' => array('pattern' => '?[a-zA-Z]{2}$'))
//                        ),
                'postcode' => array(
                    'validation' => array('presenceOf')
                ),
                'straat',
                'provincie',
                'provincie_code',
                'latitude' => array(
                    'validation' => array('presenceOf')
                ),
                'longitude' => array(
                    'validation' => array('presenceOf')
                ),
                'wijk_id',
            ),
            relations => array(
                array('type' => hasMany, 'f_table' => 'gebruiker'),
                array('type' => belongsTo, 'f_table' => 'wijk'),
            )
        ),
        'status' => array(
            settings => array(
                't_name' => 'status'
            ),
            props => array(
                'status_id',
                'description',
                'message',
            ),
            relations => array(
                array('type' => hasManyToMany, 'key' => 'status_id', 'k_table' => 'statusliststatuslink', 'k_key1' => 'status_id', 'f_table' => 'statuslist'),
            ),
        ),
        'media' => array(
            settings => array(
                't_name' => 'media'
            ),
            props => array(
                'media_id',
                'reported_count' => array(
                    'default' => 0,
                ),
                'type' => array(
                    'validation' => array('inclusionIn' => array('domain' => array('video', 'image'))),
                ),
                'url',
                'gebruiker_id',
                'actie_id',
            ),
            relations => array(
                array('type' => belongsTo, 'f_table' => 'gebruiker'),
                array('type' => belongsTo, 'f_table' => 'actie'),
            )
        ),
        'buddy' => array(
            settings => array(
                't_name' => 'buddy'
            ),
            props => array(
                'gebruiker_id' => array(
                    'validation' => array('presenceOf')
                ),
                'tijd_vanaf',
                'tijd_tot',
                'range',
                'contact_tel',
                'contact_email' => array(
                    'validation' => array('email')
                ),
                'locatie',
            ),
            relations => array(
                array('type' => hasOne, 'f_table' => 'gebruiker'),
            )
        ),
        'interesse' => array(
            settings => array(
                't_name' => 'interesse'
            ),
            props => array(
                'datum' => array(
                    'validation' => array('presenceOf')
                ),
                'gebruiker_id' => array(
                    'validation' => array('presenceOf')
                ),
                'wijk_id',
            ),
            relations => array(
                array('type' => hasOne, 'f_table' => 'gebruiker'),
            )
        ),
        'account' => array(
            settings => array(
                't_name' => 'account'
            ),
            props => array(
                'account_id',
                'email' => array(
                    'validation' => array('email', 'presenceOf', 'uniqueness')
                ),
                'wachtwoord' => array(
                    'validation' => array('presenceOf')
                ),
                'foto_link',
                'validated' => array(
                    'validation' => array('presenceOf'),
                    'default' => false,
                ),
                'accountlevel_id' => array(
                    'validation' => array('presenceOf')
                ),
                'validatie_link',
                'token',
                'salt',
                'facebook_id',
            ),
            relations => array(
//                        array('type' => hasManyToMany, 'k_table' => 'accountGebruikerLink', 'f_table' => 'gebruiker'),
                array('type' => belongsTo, 'f_table' => 'accountLevel'),
                array('type' => hasManyToMany, 'key' => 'account_id', 'k_table' => 'accountGebruikerLink', 'k_key1' => 'account_id', 'f_table' => 'gebruiker'),
            )
        ),
        'accountLevel' => array(
            settings => array(
                't_name' => 'accountlevel'
            ),
            props => array(
                'accountlevel_id',
                'level' => array(
                    'validation' => array('presenceOf', 'inclusionIn' => array('domain' => $config['application']['roles'])),
                ),
            ),
            relations => array(
                array('type' => hasMany, 'f_table' => 'account'),
            )
        ),
        'accountGebruikerLink' => array(
            settings => array(
                't_name' => 'accountgebruikerlink'
            ),
            props => array(
                'account_id',
                'gebruiker_id',
            ),
            relations => array()
        ),
        'provider' => array(
            settings => array(
                't_name' => 'provider'
            ),
            props => array(
                'provider_id',
                'naam' => array(
                    'validation' => array('presenceOf')
                ),
                'website_url' => array(
                    'validation' => array('nullable', 'url')
                ),
            ),
            relations => array(
                array('type' => hasMany, 'f_table' => 'provider_pakket'),
                array('type' => hasManyToMany, 'k_table' => 'actieproviderlink', 'f_table' => 'actie')
            )
        ),
        'providerPakket' => array(
            settings => array(
                't_name' => 'providerpakket'
            ),
            props => array(
                'provider_pakket_id',
                'prijs_maand',
                'pakket_beschrijving',
                'provider_id' => array(
                    'validation' => array('presenceOf')
                ),
            ),
            relations => array(
                array('type' => belongsTo, 'f_table' => 'provider'),
            )
        ),
        'faq' => array(
            settings => array(
                't_name' => 'faq'
            ),
            props => array(
                'faq_id',
                'question',
                'answer',
            ),
            relations => array(
            // no relations
            )
        ),
       'statuslist' => array(
           settings => array (
               't_name' => 'statuslist'
           ),
           props => array(
               'statuslist_id'
           ),
           relations => array(
                array('type' => hasOne, 'f_table' => 'actie'),
                array('type' => hasMany, 'f_table' => 'statusliststatuslink'),
                array('type' => hasManyToMany, 'key' => 'statuslist_id', 'k_table' => 'statusliststatuslink', 'k_key1' => 'statuslist_id', 'f_table' => 'status'),
           )
       ),
        'statusliststatuslink' => array(
            settings => array(
                't_name' => 'statusliststatuslink'
            ),
            props => array(
                'status_id',
                'statuslist_id',
                'active',
            ),
            relations => array(
               
            )
        ),
        'thread' => array(
            settings => array(
                't_name' => 'thread'
            ),
            props => array(
                'thread_id',
                'actie_id',
                'reported_count',
                'title',
                'description',
            ),
            relations => array(
                array('type' => hasMany, 'f_table' => 'post'),
            )
        ),
        'post' => array(
            settings => array(
              't_name' => 'post'  
            ),
            props => array(
                'post_id',
                'thread_id',
                'message',
                'gebruiker_id',
                'reported_count',
            ),
            relations => array(
                array('type' => hasOne, 'f_table' => 'thread'),
            )
        ),
		'goededoel' => array(
			settings => array(
				't_name' => 'goededoel'
			),
			props => array(
				'goededoel_id',
				'title',
				'description',
				'message',
				'target',
				'actie_id',
			),
			relations => array(
				array('type' => hasOne, 'f_table' => 'actie'),
			)
		),
//                'accountGebruiker' => array(
//                    settings => array(
//                        't_name' => 'accountgebruikerlink'
//                    ),
//                    props => array(
//                        'account_id',
//                        'gebruiker_id'
//                    ),
//                    relations => array(
//                        array('type' => hasOne, 'f_table' => 'account'),
//                        array('type' => hasOne, 'f_table' => 'gebruiker')
//                    )
//                )
    ),
    'globalConfig' => array(
        'messages' => array(
            'presenceOf' => 'cannot be null or empty',
            'email' => 'not a valid email format',
            'regex' => 'not a valid pattern',
            'inclusionIn' => 'not a valid value',
            'url' => 'not a valid url format',
            'uniqueness' => 'not unique',
        )
    )
);
