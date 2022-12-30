# Installation

## Python 3

### Mac OS
You need Python 3 to be installed along PIP. There is a good explanation from [John Lockwood](https://codesolid.com/installing-pyenv-on-a-mac/).

### Windows OS
Run `python` in the command line to check for a Python install. 
- If Python is not installed, Windows Store will open and offer an opportunity to install Python directly.
- If Python is installed it will launch and return the version; enter `quit()` to exit and proceed with the PIP install commands as listed below.


## Python Modules
With Python installed, it is possible to install the modules directly from the command line. 

Run `pip install flask` in the command line.
- **Note**: In order for Socketio to find the Flask module, it must be added to the Windows PATH folder. Follow the instructions in [this thread](https://stackoverflow.com/questions/3701646/how-to-add-to-the-pythonpath-in-windows-so-it-finds-my-modules-packages) to paste the directory in the Environment Variables settings (**My Computer** > **Properties** > **Advanced System Settings** > **Environment Variables** > **PATH** > **Edit**, then add in install location as defined in the CMD line.)

Run `pip install flask-socketio` in the command line.

Run `pip install flaskwebgui` in the command line.
- **Note**: newer versions of `flaskwebgui` use different arguments than were implemented in this code, as mentioned in [this issue thread](https://github.com/invoke-ai/InvokeAI/issues/1870); some adjustments will need to be made. but... `server` is definitly a new argument in this module, as the "Usage with Flask-SocketIO" code samples suggest [here (for v.0.3)](https://pypi.org/project/flaskwebgui/) and [here (for v.0.3.7)](https://pypi.org/project/flaskwebgui/0.3.7/)... note that v0.3.7 is the last to use the `start_server` argument. 
-- Run `pip install flaskwebgui==0.3.7` to get the last version responding to the argument as written in this application.

Run `pip install pyserial` in the command line.

Run `pip install appdirs` in the command line.

Run `pip install pyobjc` in the command line.
- **Note**: According to [this thread](https://github.com/bradtraversy/alexis_speech_assistant/issues/11#issuecomment-604962987), pyobjc is only required for MacOS & OSX based environments, not Windows.

Run `pip install numpy` in the command line.

# Run

Enter `python app.py` in the command line while in the appropriate project folder or, open the app.py file with VS Code and go to **Run** > **Run Without Debugging**.

