# M4_Notification

This microservice processes booking confirmation events from an SQS queue and sends notifications to users.

## Installation

1. Clone the repository.
2. Navigate to the microservice directory.
3. Run `npm install` to install dependencies.

## Usage

To start the microservice, simply run:

## Configuration

Ensure that your AWS credentials are properly configured.
AWS_REGION: The AWS region to use (default: 'us-east-2').

## AWS Setup

SQS Queue:
Queue URL: 'https://sqs.us-east-2.amazonaws.com/339712766050/BookingConfirmedQueue'

```bash
npm start

## Docker Build and Run:
docker build -t notification_service .
docker run -d notification_service
