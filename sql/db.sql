DROP table if EXISTS rol_permits cascade;
DROP table if EXISTS user_permits cascade;
DROP table if EXISTS details_user cascade;
DROP table if EXISTS users cascade;
DROP table if EXISTS permits cascade;
DROP table if EXISTS roles cascade;
DROP table if EXISTS status cascade;

-- GENERAL TABLES
CREATE TABLE IF NOT EXISTS status (
	id INT PRIMARY KEY,
	name VARCHAR(25) UNIQUE
);

CREATE table IF NOT EXISTS roles (
	id SERIAL PRIMARY KEY,

	name varchar(100) NOT NULL,

	status int not null,
	audit_trail json not null,

	CONSTRAINT fk_roles_status
      FOREIGN KEY(status) 
	  REFERENCES status(id)
);

CREATE TABLE IF NOT EXISTS permits (
	id SERIAL PRIMARY KEY,

	name varchar(100) NOT NULL,

	status int not null,
	audit_trail json not null,

	CONSTRAINT fk_permissions_status
      FOREIGN KEY(status) 
	  REFERENCES status(id)
);

CREATE TABLE IF NOT EXISTS rol_permits (
	id SERIAL PRIMARY KEY,

	rol_id int NOT NULL,
	permit_id int NOT NULL,

	status int not null,
	audit_trail json not null,

	CONSTRAINT fk_rol_permits_status
      FOREIGN KEY(status) 
	  REFERENCES status(id),
	CONSTRAINT fk_rol_permits
      FOREIGN KEY(rol_id) 
	  REFERENCES roles(id),
	CONSTRAINT fk_permits_rol_permits
      FOREIGN KEY(permit_id) 
	  REFERENCES permits(id)
);


CREATE table IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,

	id_number varchar(200) UNIQUE not null,
	password varchar(200),

	rol_id int,

	status int not null,
	audit_trail json not null,

	CONSTRAINT fk_rol
		FOREIGN KEY(rol_id) 
		REFERENCES roles(id),
	CONSTRAINT fk_users_status
		FOREIGN KEY(status) 
	  	REFERENCES status(id)
);

CREATE TABLE IF NOT EXISTS user_permits (
	id SERIAL PRIMARY KEY,

	user_id int NOT NULL,
	permit_id int NOT NULL,

	status int not null,
	audit_trail json not null,

	CONSTRAINT fk_rol_permits_status
      FOREIGN KEY(status) 
	  REFERENCES status(id),
	CONSTRAINT fk_user_permits
      FOREIGN KEY(user_id) 
	  REFERENCES users(id),
	CONSTRAINT fk_permits_user_permits
      FOREIGN KEY(permit_id) 
	  REFERENCES permits(id)
);

CREATE table IF NOT EXISTS details_user (
	id SERIAL PRIMARY KEY,

	society_type varchar(100) not null,
	entity_type varchar(100) not null,
	politics boolean not null,
	notification boolean not null,

	id_type varchar(100) not null,
	id_number varchar(100) UNIQUE not null,
	names json not null,
	surnames json not null,
	email varchar(100) not null,
	location varchar(100) not null,
	cellphone_number double precision not null,
	phone_number double precision not null,
	gender varchar(10) not null,

	user_id int not null,

	status int not null,
	audit_trail json not null,

	CONSTRAINT fk_user
      	FOREIGN KEY(user_id) 
	  	REFERENCES users(id),
	CONSTRAINT fk_details_user_status
		FOREIGN KEY(status) 
	  	REFERENCES status(id)
);


-- Supervisor
-- Asignar y crear roles

-- UABI
-- Debe poder confirmar registro

-- Inspección
-- Puede ver los registros

-- INSERTS
INSERT INTO status VALUES (0, 'Inactivo'), (1, 'Activo');

insert 
	into roles
	values (
		1,
		'Administrador', 
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		2,
		'Supervisor', 
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		3,
		'Adquisiciones', 
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		4,
		'UABI', 
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		5,
		'Asegurabilidad', 
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		6,
		'Inspección', 
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		7,
		'Disposición',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		8,
		'Supervición',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		9,
		'Mantenimiento',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		10,
		'Facturación',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	);

INSERT 
	INTO permits 
	VALUES (
		1,
		'crear_Usuarios',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		2,
		'detalles_Usuarios',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		3,
		'actualizar_Usuarios',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		4,
		'inactivar_Usuarios',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		5,
		'listar_Usuarios',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		6,
		'crear_Polizas',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		7,
		'detalles_Polizas',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		8,
		'actualizar_Polizas',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		9,
		'inactivar_Polizas',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		10,
		'listar_Polizas',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		11,
		'crear_CorredorSeguros',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		12,
		'detalles_CorredorSeguros',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		13,
		'actualizar_CorredorSeguros',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		14,
		'inactivar_CorredorSeguros',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		15,
		'listar_CorredorSeguros',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		16,
		'crear_CompañiaAseguradora',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		17,
		'detalles_CompañiaAseguradora',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		18,
		'actualizar_CompañiaAseguradora',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		19,
		'inactivar_CompañiaAseguradora',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		20,
		'listar_CompañiaAseguradora',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		21,
		'crear_Proyectos',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		22,
		'detalles_Proyectos',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		23,
		'actualizar_Proyectos',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		24,
		'inactivar_Proyectos',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		25,
		'finalizar_Proyectos',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		26,
		'listar_Proyectos',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		27,
		'crear_BienesInmuebles',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		28,
		'detalles_BienesInmuebles',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		29,
		'actualizar_BienesInmuebles',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		30,
		'inactivar_BienesInmuebles',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		31,
		'listar_BienesInmuebles',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		32,
		'asignar_RolesPermisos',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		33,
		'detalles_RegistrosAuditoria',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		34,
		'crear_Roles',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		35,
		'detalles_Roles',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		36,
		'actualizar_Roles',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		37,
		'inactivar_Roles',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		38,
		'listar_Roles',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	), (
		39,
		'listar_Permisos',
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	);

INSERT 
	INTO rol_permits 
	VALUES (DEFAULT, 1, 1, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 2, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 3, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 4, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 5, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 6, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 7, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 8, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 9, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 10, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 11, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 12, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 13, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 14, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 15, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 16, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 17, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 18, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 19, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 20, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 21, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 22, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 23, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 24, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 25, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 26, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 27, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 28, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 29, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 30, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 31, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 32, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 33, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 34, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 35, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 36, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 37, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 38, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	(DEFAULT, 1, 39, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'), 
	
	(DEFAULT, 2, 6, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 7, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 8, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 9, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 10, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 11, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 12, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 13, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 14, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 15, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 16, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 17, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 18, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 19, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 20, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 21, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 22, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 23, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 24, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 25, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 26, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 27, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 28, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 29, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 30, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 31, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 2, 33, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),

	(DEFAULT, 3, 22, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 3, 26, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 3, 27, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 3, 28, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 3, 29, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 3, 31, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	
	(DEFAULT, 4, 21, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 4, 22, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 4, 23, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 4, 24, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 4, 25, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 4, 26, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 4, 27, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 4, 28, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 4, 29, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 4, 30, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
	(DEFAULT, 4, 31, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}');
	