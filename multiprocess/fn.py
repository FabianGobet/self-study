import multiprocessing as mp

def fn(num):
    print(f'Process {mp.current_process().pid} got {num}.')