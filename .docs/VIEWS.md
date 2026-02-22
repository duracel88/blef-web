# Web Application Views

## Views list

- LandingPage
- LoginPage
- LobbyPage
  - MainView (80% width)
    - GamesListView
  - Sidebar/right (20% width)
    - PlayersListView
- GameRegistrationView

### Landing page
Simple loading page with logo and login button

### Login page
Login form, with username and password fields

### Lobby page
Split into two sections:
- on the right list of available players (20% width)
- in the middle (80% width) is GamesView

#### GamesListView
Button on the top to create a new game
List of ongoing games (tiles of full width)
List of games with pending registration (tiles of full width)
Game tiles with pending registration have a button "ready" | "unready"



