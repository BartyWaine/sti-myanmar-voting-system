import boto3
import os
from dotenv import load_dotenv

load_dotenv()

dynamodb = boto3.client('dynamodb',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION', 'us-east-1')
)

# Create Votes table
try:
    dynamodb.create_table(
        TableName='Votes',
        AttributeDefinitions=[
            {'AttributeName': 'vote_category', 'AttributeType': 'S'},
            {'AttributeName': 'device_token', 'AttributeType': 'S'}
        ],
        KeySchema=[
            {'AttributeName': 'vote_category', 'KeyType': 'HASH'},
            {'AttributeName': 'device_token', 'KeyType': 'RANGE'}
        ],
        BillingMode='PAY_PER_REQUEST'
    )
    print("Votes table created successfully")
except Exception as e:
    print(f"Error creating Votes table: {e}")

# Create VoteCounts table
try:
    dynamodb.create_table(
        TableName='VoteCounts',
        AttributeDefinitions=[
            {'AttributeName': 'category', 'AttributeType': 'S'}
        ],
        KeySchema=[
            {'AttributeName': 'category', 'KeyType': 'HASH'}
        ],
        BillingMode='PAY_PER_REQUEST'
    )
    print("VoteCounts table created successfully")
except Exception as e:
    print(f"Error creating VoteCounts table: {e}")