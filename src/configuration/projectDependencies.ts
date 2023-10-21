import BcryptServise from "@framework/crypto/crypto.service";
import PostgresqlDatabaseService from "@framework/database/postgresql/postgresql.service";
import { JwtService } from "@framework/jwt/jwt.service";
import { OpenAIService } from "@framework/openai/openai.service";


const dependency = {
    DatabaseService: new PostgresqlDatabaseService(),
    CryptoService: new BcryptServise(),
    JwtService: new JwtService(),
    OpenAIService: new OpenAIService(),
}

export default dependency;