import express from "express";
import amountModel from "../models/amount.model.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getBackgroundColor, calculateTotals, renderProfileWithError } from "../utils/utils.js";


