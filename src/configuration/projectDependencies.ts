import BcryptServise from "@framework/crypto/crypto.service";
import PostgresqlDatabaseService from "@framework/database/postgresql/postgresql.service";
import { JwtService } from "@framework/jwt/jwt.service";


const dependency = {
    DatabaseService: new PostgresqlDatabaseService(),
    CryptoService: new BcryptServise(),
    JwtService: new JwtService(),
}

export default dependency;