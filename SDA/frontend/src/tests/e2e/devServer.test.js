import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Development Server Startup Tests', () => {
  let frontendProcess;
  let frontendUrl = 'http://localhost:5173';
  const startupTimeout = 60000; // 60 seconds for server startup

  describe('Frontend Server Tests', () => {
    beforeAll(async () => {
      // Start frontend dev server
      return new Promise((resolve, reject) => {
        const frontendPath = path.resolve(__dirname, '../../');
        
        frontendProcess = spawn('npm', ['run', 'dev'], {
          cwd: frontendPath,
          shell: true,
          stdio: 'pipe',
        });

        let output = '';
        let errorOutput = '';

        frontendProcess.stdout.on('data', (data) => {
          output += data.toString();
          console.log(`Frontend: ${data.toString()}`);
          
          // Check if server is ready
          if (output.includes('Local:') || output.includes('localhost')) {
            // Extract port if different from default
            const portMatch = output.match(/localhost:(\d+)/);
            if (portMatch) {
              frontendUrl = `http://localhost:${portMatch[1]}`;
            }
            resolve();
          }
        });

        frontendProcess.stderr.on('data', (data) => {
          errorOutput += data.toString();
          console.error(`Frontend Error: ${data.toString()}`);
        });

        frontendProcess.on('error', (error) => {
          reject(new Error(`Failed to start frontend: ${error.message}`));
        });

        // Timeout if server doesn't start
        setTimeout(() => {
          if (frontendProcess && !frontendProcess.killed) {
            reject(new Error('Frontend server failed to start within timeout'));
          }
        }, startupTimeout);
      });
    }, startupTimeout + 5000);

    afterAll(async () => {
      // Kill frontend process
      if (frontendProcess && !frontendProcess.killed) {
        frontendProcess.kill();
      }
    });

    it('should start frontend dev server without errors', async () => {
      expect(frontendProcess).toBeDefined();
      expect(frontendProcess.killed).toBe(false);
      expect(frontendProcess.exitCode).toBeNull();
    });

    it('should respond to HTTP requests on the dev server', async () => {
      try {
        const response = await axios.get(frontendUrl, {
          timeout: 5000,
          validateStatus: () => true, // Accept any status
        });
        
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/html/);
      } catch (error) {
        throw new Error(`Frontend server not responding: ${error.message}`);
      }
    }, 10000);

    it('should serve the main index.html file', async () => {
      const response = await axios.get(frontendUrl);
      
      expect(response.data).toContain('<!DOCTYPE html>');
      expect(response.data).toContain('root');
    });

    it('should load Vite client scripts', async () => {
      const response = await axios.get(frontendUrl);
      
      expect(response.data).toContain('/@vite/client');
    });

    it('should serve static assets', async () => {
      try {
        const response = await axios.get(`${frontendUrl}/src/main.jsx`, {
          validateStatus: () => true,
        });
        
        // Vite transforms and serves these files
        expect(response.status).toBeLessThan(500);
      } catch (error) {
        // Even if 404, it should be a proper response
        expect(error.response.status).toBeDefined();
      }
    });

    it('should enable Hot Module Replacement (HMR)', async () => {
      const response = await axios.get(frontendUrl);
      
      // Vite includes HMR in dev mode
      expect(response.data).toContain('vite');
    });
  });

  describe('npm run dev Command Tests', () => {
    it('should execute npm run dev without syntax errors', async () => {
      return new Promise((resolve, reject) => {
        const testProcess = spawn('npm', ['run', 'dev', '--', '--help'], {
          cwd: path.resolve(__dirname, '../../'),
          shell: true,
          stdio: 'pipe',
        });

        let hasError = false;

        testProcess.stderr.on('data', (data) => {
          const errorMsg = data.toString();
          if (errorMsg.includes('SyntaxError') || errorMsg.includes('Error:')) {
            hasError = true;
          }
        });

        testProcess.on('close', (code) => {
          testProcess.kill();
          if (hasError) {
            reject(new Error('npm run dev has syntax errors'));
          } else {
            resolve();
          }
        });

        setTimeout(() => {
          testProcess.kill();
          if (!hasError) {
            resolve();
          }
        }, 5000);
      });
    });

    it('should have dev script defined in package.json', async () => {
      const packageJsonPath = path.resolve(__dirname, '../../package.json');
      const packageJson = await import(packageJsonPath, {
        assert: { type: 'json' },
      });

      expect(packageJson.default.scripts).toHaveProperty('dev');
      expect(packageJson.default.scripts.dev).toBeTruthy();
    });
  });

  describe('Build Validation Tests', () => {
    it('should validate vite configuration', async () => {
      const configPath = path.resolve(__dirname, '../../vite.config.js');
      
      try {
        const config = await import(configPath);
        expect(config).toBeDefined();
        expect(config.default).toBeDefined();
      } catch (error) {
        throw new Error(`Invalid vite config: ${error.message}`);
      }
    });

    it('should have all required dependencies installed', async () => {
      const packageJsonPath = path.resolve(__dirname, '../../package.json');
      const packageJson = await import(packageJsonPath, {
        assert: { type: 'json' },
      });

      const dependencies = {
        ...packageJson.default.dependencies,
        ...packageJson.default.devDependencies,
      };

      expect(dependencies).toHaveProperty('vite');
      expect(dependencies).toHaveProperty('react');
      expect(dependencies).toHaveProperty('react-dom');
    });
  });

  describe('Environment Validation Tests', () => {
    it('should support ES modules', () => {
      expect(import.meta.url).toBeDefined();
    });

    it('should have Node.js version compatible with Vite', () => {
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
      
      expect(majorVersion).toBeGreaterThanOrEqual(14);
    });
  });
});
