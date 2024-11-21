import multiprocessing as mp
import numpy as np
import time

def task(num):
    sleep_time = np.random.rand() * 1.5
    print(f"Sleeping for {sleep_time} seconds")
    time.sleep(sleep_time)
    return num, mp.current_process().pid
