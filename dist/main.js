"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    console.log('[Main] Starting application bootstrap...');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    console.log('[Main] NestJS application created');
    const port = process.env.PORT ?? 3000;
    console.log('[Main] Application will listen on port:', port);
    await app.listen(port);
    console.log(`[Main] Application is running on http://localhost:${port}`);
}
bootstrap().catch((error) => {
    console.error('[Main] Failed to start application:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map