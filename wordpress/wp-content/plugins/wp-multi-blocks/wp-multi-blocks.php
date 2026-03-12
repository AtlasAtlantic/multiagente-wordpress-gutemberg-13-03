<?php
/**
 * Plugin Name: WP Multi Blocks
 * Description: Plugin de ejemplo con bloques Gutenberg: CTA, testimonio y lista dinámica de posts.
 * Version: 1.0.0
 * Author: Your Name
 * Text Domain: wp-multi-blocks
 * Requires at least: 6.0
 * Requires PHP: 8.2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const WP_MULTI_BLOCKS_VERSION = '1.0.0';
const WP_MULTI_BLOCKS_PLUGIN_FILE = __FILE__;
const WP_MULTI_BLOCKS_PLUGIN_DIR = __DIR__;

require_once WP_MULTI_BLOCKS_PLUGIN_DIR . '/includes/class-wp-multi-blocks.php';
require_once WP_MULTI_BLOCKS_PLUGIN_DIR . '/includes/class-wp-multi-blocks-post-list-render.php';

add_action( 'init', [ 'WP_Multi_Blocks_Plugin', 'init' ] );

