import heapq

def heuristic(cell, goal):
    row_of_cell = cell[0]
    row_of_goal = goal[0]
    col_of_cell = cell[1]
    col_of_goal = goal[1]
    distance = abs(row_of_cell - row_of_goal) + abs(col_of_cell - col_of_goal)

    return distance

def get_neighbors(cell, grid):
    row = cell[0]
    col = cell[1]
    up = (row - 1, col)
    down = (row + 1, col)
    left = (row, col - 1)
    right = (row, col + 1)

    no_of_rows = len(grid)
    no_of_col = len(grid[0])  

    neighbours = []
    if 0<= up[0] < no_of_rows and 0<= up[1] < no_of_col:
        if grid[up[0]][up[1]] == 0:
            neighbours.append(up)

    if 0<= down[0] < no_of_rows and 0<= down[1] < no_of_col:
            if grid[down[0]][down[1]] == 0:
                neighbours.append(down)

    if 0<= left[0] < no_of_rows and 0<= left[1] < no_of_col:
            if grid[left[0]][left[1]] == 0:
                neighbours.append(left)

    if 0<= right[0] < no_of_rows and 0<= right[1] < no_of_col:
            if grid[right[0]][right[1]] == 0:
                neighbours.append(right)

    return neighbours

def astar(grid, start, goal):
    open_list = []
    heapq.heappush(open_list, (heuristic(start, goal), start))

    g_scores = {start: 0}
    parents = {}
    closed_set = set()

    while open_list:
        current_f, current = heapq.heappop(open_list)

        if current == goal:
            return reconstruct_path(parents, current)

        if current in closed_set:
            continue

        closed_set.add(current)

        for neighbour in get_neighbors(current, grid):
            if neighbour in closed_set:
                continue

            tentative_g = g_scores[current] + 1

            if neighbour not in g_scores or tentative_g < g_scores[neighbour]:
                g_scores[neighbour] = tentative_g
                parents[neighbour] = current
                f_score = tentative_g + heuristic(neighbour, goal)
                heapq.heappush(open_list, (f_score, neighbour))

    return None

def reconstruct_path(parents, current):
    path = [current]
    while current in parents:
        current = parents[current]
        path.append(current)
    path.reverse()
    return path
        
if __name__ == "__main__":
    test_grid = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
    ]
    print(astar(test_grid, (0, 0), (2, 2)))