import subprocess
from pathlib import Path

my_path = str(Path(__file__).resolve().parent.parent)

def test_healthcheck():
    command = my_path + '/cli/healthcheck'
    out = subprocess.run(command.split(), stdout=subprocess.PIPE).stdout
    assert b'200: Success' in out

def test_resetpasses():
    command = my_path + '/cli/resetpasses'
    out = subprocess.run(command.split(), stdout=subprocess.PIPE).stdout
    assert b'200: Success' in out

def test_resetstations():
    command = my_path + '/cli/resetstations'
    out = subprocess.run(command.split(), stdout=subprocess.PIPE).stdout
    assert b'200: Success' in out

def test_resetvehicles():
    command = my_path + '/cli/resetvehicles'
    out = subprocess.run(command.split(), stdout=subprocess.PIPE).stdout
    assert b'200: Success' in out