# DFX Raycast Extension

A comprehensive Raycast extension for interacting with DFX and the Internet Computer. This extension provides a convenient interface to manage your DFX environment, identities, and more directly from Raycast.

## Current Features

### Identity Management
- List all DFX identities
- View default identity
- Display principal IDs
- Switch between identities
- Copy identity names and principal IDs to clipboard
- Debug information for troubleshooting

### DFX Control
- Start DFX replica
- Stop DFX replica
- View DFX status

## Planned Features

- Canister management (deploy, upgrade, delete)
- Cycle management
- Network configuration
- Project management
- Asset management
- And more...

## Prerequisites

- [Raycast](https://raycast.com/) installed
- [DFX](https://internetcomputer.org/docs/current/developer-docs/smart-contracts/getting-started/installing-dfx) installed and configured
- At least one DFX identity created

## Installation

1. Open Raycast
2. Go to Extensions
3. Search for "DFX"
4. Click Install

## Usage

1. Open Raycast
2. Type "DFX" to access the extension
3. Choose from available commands:
   - Identity Management
     - View all identities
     - Switch between identities
     - Copy principal IDs
     - Copy identity names
     - View debug information
   - DFX Control
     - Start DFX replica
     - Stop DFX replica
     - Check DFX status

## Commands

### Identity Management
- `dfx identity list` - Lists all available identities
- `dfx identity use <identity>` - Switches to the specified identity
- `dfx identity get-principal` - Gets the principal ID for the current identity

### DFX Control
- `dfx start` - Starts the DFX replica
- `dfx stop` - Stops the DFX replica
- `dfx status` - Shows the current status of DFX

## Documentation

### Internet Computer
- [Internet Computer Documentation](https://internetcomputer.org/docs/current/developer-docs/)
- [Internet Computer Overview](https://internetcomputer.org/docs/current/developer-docs/ic-overview)
- [Internet Computer Whitepaper](https://internetcomputer.org/whitepaper.pdf)

### DFX
- [DFX Documentation](https://internetcomputer.org/docs/current/developer-docs/smart-contracts/getting-started/installing-dfx)
- [DFX Commands Reference](https://internetcomputer.org/docs/current/developer-docs/smart-contracts/getting-started/dfx-commands-reference)
- [DFX Identity Management](https://internetcomputer.org/docs/current/developer-docs/smart-contracts/getting-started/dfx-identity)

### Development
- [Raycast Extensions Documentation](https://developers.raycast.com/)
- [Raycast API Reference](https://developers.raycast.com/api-reference)

## Troubleshooting

If you encounter any issues:

1. Check if DFX is properly installed and in your PATH
2. Verify you have at least one identity created using `dfx identity new`
3. Use the debug information feature in the extension to view detailed logs
4. Ensure you have the latest version of DFX installed
5. Check if the DFX replica is running when trying to use DFX commands

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. We're particularly interested in:
- New DFX command integrations
- UI/UX improvements
- Bug fixes
- Documentation improvements

## License

This project is licensed under the MIT License - see the LICENSE file for details.