USE rental_system_db;

UPDATE vehicles SET image_url = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600' WHERE id = 1;
UPDATE vehicles SET image_url = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600' WHERE id = 2;
UPDATE vehicles SET image_url = 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600' WHERE id = 3;
UPDATE vehicles SET image_url = 'https://images.unsplash.com/photo-1622185135505-2d795003994a?w=600' WHERE id = 4;
UPDATE vehicles SET image_url = 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600' WHERE id = 5;
UPDATE vehicles SET image_url = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600' WHERE id = 6;
UPDATE vehicles SET image_url = 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=600' WHERE id = 7;
UPDATE vehicles SET image_url = 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600' WHERE id = 8;
UPDATE vehicles SET image_url = 'https://images.unsplash.com/photo-1525160354320-d8e92641c563?w=600' WHERE id = 9;
UPDATE vehicles SET image_url = 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600' WHERE id = 10;
UPDATE vehicles SET image_url = 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600' WHERE id = 11;
UPDATE vehicles SET image_url = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600' WHERE id = 12;

SELECT id, name, category, image_url FROM vehicles;
