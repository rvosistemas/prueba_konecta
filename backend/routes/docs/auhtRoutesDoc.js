// authRoutesDocs.js

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               hire_date:
 *                 type: string
 *                 format: date
 *                 example: "01/01/2020"
 *               salary:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: User registered successfully
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Login successful"
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad Request
 */



/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
const authRoutesDocs = {};

export default authRoutesDocs;
