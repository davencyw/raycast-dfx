# DFX Identity Manager for Raycast

A Raycast extension for managing DFX identities on the Internet Computer. This extension provides a convenient interface to view, switch between, and manage your DFX identities directly from Raycast.

## Features

- List all DFX identities
- View default identity
- Display principal IDs
- Switch between identities
- Copy identity names and principal IDs to clipboard
- Debug information for troubleshooting

## Prerequisites

- [Raycast](https://raycast.com/) installed
- [DFX](https://internetcomputer.org/docs/current/developer-docs/smart-contracts/getting-started/installing-dfx) installed and configured
- At least one DFX identity created

## Installation

1. Open Raycast
2. Go to Extensions
3. Search for "DFX Identity Manager"
4. Click Install

## Usage

1. Open Raycast
2. Type "DFX Identity" to access the extension
3. Use the following actions:
   - View all your identities
   - Switch between identities
   - Copy principal IDs
   - Copy identity names
   - View debug information

## Commands

- `dfx identity list` - Lists all available identities
- `dfx identity use <identity>` - Switches to the specified identity
- `dfx identity get-principal` - Gets the principal ID for the current identity

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.