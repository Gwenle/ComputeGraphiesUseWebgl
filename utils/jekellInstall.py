import subprocess
import re
comm="sudo gem install jekyll "
pattern='`(.*)`'

def pros(commAnd):
    process = subprocess.Popen(commAnd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output,error=process.communicate()

    subError=re.findall(pattern,str(error))
    print('!',subError)
    if len(subError)==0:
        return
    else:
        sr="sudo "+subError[0]
        lt=str(pros(sr))
        if lt.find(pattern):
            subprocess.Popen(commAnd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return error

res=str(pros(comm))   
while res.find(pattern):
    res=str(pros(comm))