import heapq

def heuristic(cell, goal):
    row_of_cell, col_of_cell, alt_of_cell = cell[0], cell[1], cell[2]
    row_of_goal, col_of_goal, alt_of_goal = goal[0], goal[1], goal[2]
    distance = (
        abs(row_of_cell - row_of_goal) 
        + abs(col_of_cell - col_of_goal)
        + abs(alt_of_cell - alt_of_goal)
    )

    return distance

def get_neighbors(cell, grid):
    row, col, alt = cell[0], cell[1], cell[2]

    up = (row - 1, col, alt)
    down = (row + 1, col, alt)
    left = (row, col - 1, alt)
    right = (row, col + 1, alt)
    ascend = (row, col, alt + 1)
    descend = (row, col, alt - 1)

    no_of_rows = len(grid)
    no_of_col = len(grid[0])
    no_of_alt = len(grid[0][0])

    directions = [up, down,left, right, ascend, descend]
    neighbours = []

    for d in directions:
        d_row, d_col, d_alt = d[0], d[1], d[2]
        if 0 <= d_row < no_of_rows and 0 <= d_col < no_of_col and 0 <= d_alt < no_of_alt:
            if grid[d_row][d_col][d_alt] == 0:
                neighbours.append(d)

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
    test_grid_3d = [
    [[0, 0], [0, 0]],
    [[0, 1], [0, 0]]
    ]
    print(astar(test_grid_3d, (0, 0, 0), (1, 1, 1)))