DROP PROCEDURE IF EXISTS create_company;

DELIMITER |

CREATE PROCEDURE create_company(
IN iname VARCHAR(100), IN iaddress VARCHAR(100),
IN iid13 VARCHAR(13), IN itaxbr VARCHAR(5),
IN itype INT(11), IN iyear INT(4),
IN iowner VARCHAR(100), IN ipartner VARCHAR(100),
IN icode VARCHAR(10), IN iapikey VARCHAR(50)
)

BEGIN
  INSERT INTO companys
  (name, address, id13, taxbr, type, year, owner, partner, code, created_at, updated_at)
  VALUES
  (iname, iaddress, iid13, itaxbr, itype, iyear, iowner, ipartner, icode, NOW(), NOW())
  ;

  INSERT INTO companykey
  (companykey.company_id, companykey.key)
  VALUES
  (last_insert_id(), iapikey)
  ;
END
|

DELIMITER ;
