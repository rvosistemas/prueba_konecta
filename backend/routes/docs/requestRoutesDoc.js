/**
 * @swagger
 * components:
 *   schemas:
 *     Request:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         code:
 *           type: string
 *           example: "REQ-001"
 *         description:
 *           type: string
 *           example: "Request for new equipment"
 *         summary:
 *           type: string
 *           example: "This is a summary of the request"
 *         employee_id:
 *           type: integer
 *           example: 123
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-02T12:00:00Z"
 */

/**
 * @swagger
 * /requests:
 *   get:
 *     summary: Get all requests
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /requests/{id}:
 *   get:
 *     summary: Get a request by ID
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The request ID
 *     responses:
 *       200:
 *         description: Request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Request not found
 */

/**
 * @swagger
 * /requests:
 *   post:
 *     summary: Create a new request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               summary:
 *                 type: string
 *               employee_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Request created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad Request
 */

/**
 * @swagger
 * /requests/{id}:
 *   put:
 *     summary: Update a request by ID
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               summary:
 *                 type: string
 *               employee_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Request updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Request not found
 */

/**
 * @swagger
 * /requests/{id}:
 *   delete:
 *     summary: Deactivate a request by ID
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The request ID
 *     responses:
 *       200:
 *         description: Request deactivated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Request not found
 */

const requestRoutesDocs = {};

export default requestRoutesDocs;
