/* Copyright (C) Airfordable, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emmanuel Buah <emmanuel@airforable.com>, Aug 2016
 */
/*jshint esversion: 6 */
/* global require */
/*jslint node: true */
'use strict';

import mongoose from './mongoose';
import Installment from './installment';
import Reward from './reward';

var BookingSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  userEmail: { type: String, required: false },
  sourceAirport: { type: String, required: true, index: true },
  destinationAirport: { type: String, required: true, index: true },
  departureDate: { type: Date, required: true },
  returnDate: { type: Date, required: false },
  departureDateString: { type: String, required: false },
  returnDateString: { type: String, required: false },
  fareCost: { type: Number, required: true },
  layawayFee: { type: Number, required: true },
  totalCredit: { type: Number, default: 0 },
  finalized: { type: Boolean },
  paymentInfo: {
    plan: { type: String, enum: ['Monthly', 'Bi-Weekly'], required: true },
    downPayment: {
      split: { type: Boolean, required: true },
      amount: { type: Number, required: true },
      paid: { type: Boolean, required: true, default: false },
      installments: []
    },
    installmentAmount: { type: Number, required: true },
    installments: [ Installment.schema ]
  },
  applicableCredits: [{
      type: String,
      ref: "Reward"
    }],
  insurance: {
    on: { type: Date, required: false },
    amount: { type: Number, required: false }
  },
  purchased: {
    on: { type: Date, required: false, default: null,  index: true },
    amount: { type: Number, required: false, default: null }
  },
  defaulted: { type: Date, required: false , default: null },
  delivered: { type: Date, required: false, default: null },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Paid In Full', 'Cancelled', 'Denied', 'Defaulted'], default: 'Not Started' },
  icaId: { type: String },
  sadId: { type: String },
  travelers: {
    additional: { type: Array, default: [] }
  },
  images: { type: Array, default: [] },
  confirmationCode: { type: String, index: true },
  airlineConfirmationCode: { type: String, index: true },
  notes: { type: String , index: true},
  viaAgent: { type: String },
  _user: { type: String, ref: 'User', required: true },
  _ica: {type: String, ref: 'Image' },
  _eTicket: { type: String, ref: 'Image' },
  _sad: { type: String, ref: 'Image' },
  _sourceAirport: { type: String, ref: 'Airport' },
  _destinationAirport: { type: String, ref: 'Airport' }
}, {timestamps: true});

BookingSchema.virtual('departureAirport')
.get(function () {
   return this.get('sourceAirport');
})
.set(function (v) {
   return this.set('sourceAirport', v);
});


var Booking = mongoose.model('Booking', BookingSchema);

export default Booking;