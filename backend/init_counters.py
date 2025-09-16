import boto3
import os
from dotenv import load_dotenv

load_dotenv()

dynamodb = boto3.client('dynamodb',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION', 'us-east-1')
)

categories = ["King", "Queen", "option_a", "option_b"]

for category in categories:
    try:
        dynamodb.put_item(
            TableName='VoteCounts',
            Item={
                'category': {'S': category},
                'count': {'N': '0'}
            }
        )
        print(f"Initialized {category} counter to 0")
    except Exception as e:
        print(f"Error initializing {category}: {e}")