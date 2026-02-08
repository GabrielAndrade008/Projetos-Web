import pygame
import sys

# Inicializa o Pygame
pygame.init()

# Tamanho da tela
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Pong")

# Cores
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

# Posições iniciais
ball_pos = [WIDTH // 2, HEIGHT // 2]
ball_vel = [4, 4]
ball_radius = 10

paddle_width, paddle_height = 10, 100
player1_pos = [20, HEIGHT // 2 - paddle_height // 2]
player2_pos = [WIDTH - 30, HEIGHT // 2 - paddle_height // 2]
paddle_speed = 6

clock = pygame.time.Clock()

# Pontuação
score1 = 0
score2 = 0
font = pygame.font.SysFont("Arial", 30)

# Loop principal
running = True
while running:
    screen.fill(BLACK)

    # Eventos
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Movimento dos jogadores
    keys = pygame.key.get_pressed()
    # Jogador 1
    if keys[pygame.K_w] and player1_pos[1] > 0:
        player1_pos[1] -= paddle_speed
    if keys[pygame.K_s] and player1_pos[1] < HEIGHT - paddle_height:
        player1_pos[1] += paddle_speed
    # Jogador 2
    if keys[pygame.K_UP] and player2_pos[1] > 0:
        player2_pos[1] -= paddle_speed
    if keys[pygame.K_DOWN] and player2_pos[1] < HEIGHT - paddle_height:
        player2_pos[1] += paddle_speed

    # Movimento da bola
    ball_pos[0] += ball_vel[0]
    ball_pos[1] += ball_vel[1]

    # Rebater nas paredes
    if ball_pos[1] - ball_radius <= 0 or ball_pos[1] + ball_radius >= HEIGHT:
        ball_vel[1] *= -1

    # Rebater nas raquetes
    if (player1_pos[0] < ball_pos[0] - ball_radius < player1_pos[0] + paddle_width and
        player1_pos[1] < ball_pos[1] < player1_pos[1] + paddle_height):
        ball_vel[0] *= -1
    elif (player2_pos[0] < ball_pos[0] + ball_radius < player2_pos[0] + paddle_width and
          player2_pos[1] < ball_pos[1] < player2_pos[1] + paddle_height):
        ball_vel[0] *= -1

    # Pontuação
    if ball_pos[0] < 0:
        score2 += 1
        ball_pos = [WIDTH // 2, HEIGHT // 2]
        ball_vel[0] *= -1
    elif ball_pos[0] > WIDTH:
        score1 += 1
        ball_pos = [WIDTH // 2, HEIGHT // 2]
        ball_vel[0] *= -1

    # Desenhar os elementos
    pygame.draw.rect(screen, WHITE, (*player1_pos, paddle_width, paddle_height))
    pygame.draw.rect(screen, WHITE, (*player2_pos, paddle_width, paddle_height))
    pygame.draw.circle(screen, WHITE, ball_pos, ball_radius)
    pygame.draw.aaline(screen, WHITE, (WIDTH // 2, 0), (WIDTH // 2, HEIGHT))

    # Mostrar pontuação
    text1 = font.render(f"{score1}", True, WHITE)
    text2 = font.render(f"{score2}", True, WHITE)
    screen.blit(text1, (WIDTH // 4, 20))
    screen.blit(text2, (3 * WIDTH // 4, 20))

    pygame.display.flip()
    clock.tick(60)

pygame.quit()
sys.exit()
