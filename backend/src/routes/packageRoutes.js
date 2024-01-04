const express = require('express');
const packageRouter = express.Router();
const {
  auth_access } = require('../middlewares/auth');
const { createPackage,
  updatePackage,
  deletePackage,
  getAllPackages,
  getApporovedPackageById, getUnapprovedPackages, getAprrovedPackages, getPackageById, getPackageBySearch, getApprovedPackagesCount, getPackageByLocation
} = require('../controllers/packageController');

/**
 * @swagger
 * components:
 *   schemas:
 *     TourPackage:
 *       type: object
 *       required:
 *         - title
 *         - overview
 *         - whatsIncluded
 *         - tourItinerary
 *         - price
 *         - duration
 *         - agentName
 *         - agentId
 *         - isDeleted
 *         - isApproved
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the tour package
 *         overview:
 *           type: string
 *           description: An overview of the tour package
 *         whatsIncluded:
 *           type: string
 *           description: Details of what is included in the tour package
 *         tourItinerary:
 *           type: string
 *           description: The itinerary of the tour
 *         price:
 *           type: number
 *           description: The price of the tour package
 *         duration:
 *           type: number
 *           description: The duration of the tour in days
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of image URLs for the tour package
 *         locationTags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags representing locations associated with the tour package
 *         agentName:
 *           type: string
 *           description: The name of the agent offering the tour package
 *         agentId:
 *           type: string
 *           description: The ID of the agent offering the tour package
 *         isDeleted:
 *           type: boolean
 *           description: Flag indicating if the tour package is deleted
 *         isApproved:
 *           type: boolean
 *           description: Flag indicating if the tour package is approved
 */

/**
 * @swagger
 * /packages/createPackage:
 *   post:
 *     summary: Create a new tour package
 *     tags: [TourPackages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TourPackage'
 *     responses:
 *       201:
 *         description: Tour package created successfully
 *       400:
 *         description: Bad request, missing or invalid fields
 *       500:
 *         description: Server error
 */
packageRouter.post('/createPackage', auth_access, createPackage);


packageRouter.post('/createPackage/:id', auth_access, createPackage);

/**
 * @swagger
 * /packages:
 *   get:
 *     summary: Get all tour packages
 *     tags: [TourPackages]
 *     responses:
 *       200:
 *         description: An array of tour packages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TourPackage'
 *       500:
 *         description: Server error
 */
packageRouter.get('/', getAprrovedPackages);

packageRouter.get('/getAllPackages', auth_access, getAllPackages);

packageRouter.get('/getUnapprovedPackages', auth_access, getUnapprovedPackages);

/**
 * @swagger
 * /packages/{id}:
 *   get:
 *     summary: Get a tour package by ID
 *     tags: [TourPackages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tour package to retrieve
 *     responses:
 *       200:
 *         description: A single tour package
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TourPackage'
 *       404:
 *         description: Tour package not found
 *       500:
 *         description: Server error
 * 
 */

packageRouter.get('/getPackageBySearch', getPackageBySearch);
packageRouter.get('/getPackageByLocation', getPackageByLocation);
packageRouter.get('/getApprovedPackagesCount', getApprovedPackagesCount);

packageRouter.get('/:id', getApporovedPackageById);

packageRouter.get('/getPackage/:id', auth_access, getPackageById);
/**
 * @swagger
 * /packages/updatePackage/{id}:
 *   put:
 *     summary: Update a tour package by ID
 *     tags: [TourPackages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tour package to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TourPackage'
 *     responses:
 *       200:
 *         description: Tour package updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Tour package not found
 *       500:
 *         description: Server error
 */
packageRouter.put('/updatePackage/:id', auth_access, updatePackage);

/**
 * @swagger
 * /packages/deletePackage/{id}:
 *   delete:
 *     summary: Delete a tour package by ID
 *     tags: [TourPackages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tour package to delete
 *     responses:
 *       200:
 *         description: Tour package deleted successfully
 *       404:
 *         description: Tour package not found
 *       500:
 *         description: Server error
 */

packageRouter.delete('/deletePackage/:id', auth_access, deletePackage);



module.exports = packageRouter;