# This entrypoint file to be used in development. Start by reading README.md
import port_scanner
from unittest import main

# Run unit tests automatically
main(module='test_module', exit=False)