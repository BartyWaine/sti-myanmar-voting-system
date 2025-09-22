import os
import psycopg2
from psycopg2.extras import RealDictCursor
import json

DATABASE_URL = os.getenv('DATABASE_URL')

def get_db_connection():
    if DATABASE_URL:
        return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    else:
        # Fallback to in-memory for local development
        return None

def init_database():
    conn = get_db_connection()
    if not conn:
        return
    
    try:
        with conn.cursor() as cur:
            # Create tables
            cur.execute('''
                CREATE TABLE IF NOT EXISTS votes (
                    id SERIAL PRIMARY KEY,
                    device_token VARCHAR(255) NOT NULL,
                    category VARCHAR(100) NOT NULL,
                    candidate_name VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(device_token, category)
                )
            ''')
            
            cur.execute('''
                CREATE TABLE IF NOT EXISTS active_users (
                    device_token VARCHAR(255) PRIMARY KEY,
                    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()
    except Exception as e:
        print(f"Database init error: {e}")
    finally:
        conn.close()

def get_vote_counts():
    conn = get_db_connection()
    if not conn:
        return {"King": 0, "Queen": 0, "Prince": 0, "Princess": 0, "Best Costume Male": 0, "Best Costume Female": 0, "Best Performance Award": 0, "total": 0}
    
    try:
        with conn.cursor() as cur:
            cur.execute('SELECT category, COUNT(*) as count FROM votes GROUP BY category')
            results = cur.fetchall()
            
            counts = {"King": 0, "Queen": 0, "Prince": 0, "Princess": 0, "Best Costume Male": 0, "Best Costume Female": 0, "Best Performance Award": 0}
            
            for row in results:
                if row['category'] in counts:
                    counts[row['category']] = row['count']
            
            counts['total'] = sum(counts.values())
            return counts
    except Exception as e:
        print(f"Database error: {e}")
        return {"King": 0, "Queen": 0, "Prince": 0, "Princess": 0, "Best Costume Male": 0, "Best Costume Female": 0, "Best Performance Award": 0, "total": 0}
    finally:
        conn.close()

def cast_vote_db(device_token, category, candidate_name):
    conn = get_db_connection()
    if not conn:
        return False
    
    try:
        with conn.cursor() as cur:
            cur.execute(
                'INSERT INTO votes (device_token, category, candidate_name) VALUES (%s, %s, %s) ON CONFLICT DO NOTHING',
                (device_token, category, candidate_name)
            )
            conn.commit()
            return cur.rowcount > 0
    except Exception as e:
        print(f"Vote error: {e}")
        return False
    finally:
        conn.close()

def has_voted_for_category_db(device_token, category):
    conn = get_db_connection()
    if not conn:
        return False
    
    try:
        with conn.cursor() as cur:
            cur.execute('SELECT 1 FROM votes WHERE device_token = %s AND category = %s', (device_token, category))
            return cur.fetchone() is not None
    except Exception as e:
        print(f"Check vote error: {e}")
        return False
    finally:
        conn.close()

def get_results_db():
    conn = get_db_connection()
    if not conn:
        return {}
    
    try:
        with conn.cursor() as cur:
            categories = ["King", "Queen", "Prince", "Princess", "Best Costume Male", "Best Costume Female", "Best Performance Award"]
            results = {}
            
            for category in categories:
                cur.execute('''
                    SELECT candidate_name, COUNT(*) as votes 
                    FROM votes 
                    WHERE category = %s AND candidate_name IS NOT NULL
                    GROUP BY candidate_name 
                    ORDER BY votes DESC
                ''', (category,))
                
                candidates = cur.fetchall()
                total_votes = sum(c['votes'] for c in candidates)
                
                if candidates:
                    leading = candidates[0]
                    results[category] = {
                        "leading_candidate": leading['candidate_name'],
                        "votes": leading['votes'],
                        "total_votes": total_votes,
                        "percentage": round((leading['votes'] / total_votes * 100) if total_votes > 0 else 0, 1),
                        "all_candidates": {c['candidate_name']: c['votes'] for c in candidates}
                    }
                else:
                    results[category] = {
                        "leading_candidate": "No votes yet",
                        "votes": 0,
                        "total_votes": 0,
                        "percentage": 0,
                        "all_candidates": {}
                    }
            
            return results
    except Exception as e:
        print(f"Results error: {e}")
        return {}
    finally:
        conn.close()

def reset_all_votes_db():
    conn = get_db_connection()
    if not conn:
        return
    
    try:
        with conn.cursor() as cur:
            cur.execute('DELETE FROM votes')
            cur.execute('DELETE FROM active_users')
            conn.commit()
    except Exception as e:
        print(f"Reset error: {e}")
    finally:
        conn.close()

def update_user_activity_db(device_token):
    conn = get_db_connection()
    if not conn:
        return
    
    try:
        with conn.cursor() as cur:
            cur.execute('''
                INSERT INTO active_users (device_token, last_seen) 
                VALUES (%s, CURRENT_TIMESTAMP)
                ON CONFLICT (device_token) 
                DO UPDATE SET last_seen = CURRENT_TIMESTAMP
            ''', (device_token,))
            
            # Clean up old users (older than 30 seconds)
            cur.execute("DELETE FROM active_users WHERE last_seen < NOW() - INTERVAL '30 seconds'")
            conn.commit()
    except Exception as e:
        print(f"User activity error: {e}")
    finally:
        conn.close()

def get_concurrent_users_db():
    conn = get_db_connection()
    if not conn:
        return 0
    
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) as count FROM active_users WHERE last_seen > NOW() - INTERVAL '30 seconds'")
            result = cur.fetchone()
            return result['count'] if result else 0
    except Exception as e:
        print(f"Concurrent users error: {e}")
        return 0
    finally:
        conn.close()