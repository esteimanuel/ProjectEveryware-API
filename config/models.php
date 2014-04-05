<?php
if(!defined('hasMany')) {
    
    define('hasMany',       'hasMany');         //Defines a 1-n relationship, 'key' => 'tableKey (id)', 'f_table' => 'foreign_table', 'f_key' => 'foreign_key (table_id)'
    define('hasOne',        'hasOne');          //Defines a 1-1 relationship, 'key' => 'tableKey (id)', 'f_table' => 'foreign_table', 'f_key' => 'foreign_key (table_id)'
    define('belongsTo',     'belongsTo');       //Defines a n-1 relationship, 'f_key' => 'foreign_key (f_table_id)', => 'f_table' => 'foreign_table', 'key' => 'tableKey (id)'
    define('hasManyToMany', 'hasManyToMany');   //Defines a n-n relationship, 'key' => 'id', 'k_table' => 'koppel_table', 'k_key1' => 'kt_key1_id', 'k_key2' => 'kt_key1_id', 'f_table' => 'foreign_talbe', 'f_key' => 'ftable_id'),

    define('props',         'properties');
    define('relations',     'relations');
    define('settings',      'settings');
}

$config = include 'config.php';

return array(
	'models' => array(
		'user' => array(
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
			'actie_id',
			'postcode_id',
			'shared_info',
                    ),
                    relations => array(
                        array('type' => belongsTo, 'f_key' => 'actie_id', 'f_table' => 'actie', 'key' => 'id'),
                        array('type' => belongsTo, 'f_table' => 'postcode'),
                        array('type' => belongsTo, 'f_table' => 'providerpakket'),
                        array('type' => hasOne, 'f_table' => 'interesse'),
                        array('type' => hasOne, 'f_table' => 'buddy'),
                        array('type' => hasOne, 'f_table' => 'account'),
                        array('type' => hasMany, 'f_table' => 'media'),
                    )
                ),
                'actie' => array(
                    settings => array(
                        't_name' => 'actie'
                    ),
                    props => array(
			'id',
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
                        'naam',
                    ),
                    relations => array(
                        array('type' => hasMany, 'f_table' => 'gebruiker'),
                        array('type' => hasMany, 'f_table' => 'media'),
                        array('type' => belongsTo, 'f_table' => 'wijk'),
                        array('type' => hasOne, 'f_table' => 'status'),
                        array('type' => hasManyToMany, 'key' => 'id', 'k_table' => 'actieproviderlink', 'k_key1' => 'actie_id', 'k_key2' => 'provider_id', 'f_table' => 'provider', 'f_key' => 'id'),
                    )
                ),  
		'wijk' => array(
                    settings => array(
                        't_name' => 'wijk'
                    ),
                    props => array(
			'id',
			'target',
			'actie_duur',
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
			'id',
			'plaats',
			'gemeente',
			'postcode' => array(
				'validation' => array('presenceOf', 'regex' => array('pattern' => '^[1-9][0-9]{3}\s?[a-zA-Z]{2}$')),
			), 
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
		'media' => array(
                    settings => array(
                        't_name' => 'media'
                    ),
                    props => array(
			'id',
			'reported_count' => array(
				'default' => 0,
			),
			'type' => array(
				'validation' => array('inclusionIn' => array('domain' => array('video', 'image'))),
			),
			'url',
			'gebruiker_id',
			'actie_id' => array(
				'validation' => array('presenceOf')
			),
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
			'email' => array(
				'validation' => array('email', 'presenceOf')
			),
			'gebruiker_id',
			'wachtwoord' => array(
				'validation' => array('presenceOf')
			),
			'foto_link',
			'validated' => array(
				'validation' => array('presenceOf'),
				'default' => false,
			),
			'accountLevel_id' => array(
				'validation' => array('presenceOf')
			),
			'validatie_link',
                        'token',
                    ),
                    relations => array(
                        array('type' => hasOne, 'f_table' => 'gebruiker'),
                        array('type' => belongsTo, 'f_table' => 'accountlevel'),
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
		'provider_pakket' => array(
                    settings => array(
                        't_name' => 'provider_pakket'
                    ),
                    props => array(
			'id',
			'prijs_maand',
			'pakket_beschrijving',
			'provider_id' => array(
				'validation' => array('presenceOf')
			),
                    ),
                    relations => array(
                        array('type' => belongsTo, 'f_table' => 'provider'),
                    )
		)
	),
	'globalConfig' => array(
		'messages' => array(
			'presenceOf' => 'cannot be null or empty',
			'email' => 'not a valid email format',
			'regex' => 'not a valid pattern',
			'inclusionIn' => 'not a valid value',
                        'url' => ' not a valid url format'
		)
	)
);