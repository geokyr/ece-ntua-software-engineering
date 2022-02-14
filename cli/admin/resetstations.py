import argparse
import requests
import csv

my_parser = argparse.ArgumentParser(description='initializes station collection in database')
my_parser.add_argument('--format', metavar='{json|csv}', type=str, 
                        help='select the format type of the output (json or csv)')
args = my_parser.parse_args()
input_format = args.format

r = requests.post('http://127.0.0.1:9103/admin/resetstations')
data = r.json()

try:    
    if input_format == 'json':
        print(data)
    elif input_format == 'csv': 
        output_file = open('../csv/resetstations.csv', 'w')
        output = csv.writer(output_file)
        output.writerow(data.keys())
        output.writerow(data.values())
except Exception as e:
    print(e)