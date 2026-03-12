<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WP_Multi_Blocks_Plugin {
	public static function init(): void {
		$base_dir = WP_MULTI_BLOCKS_PLUGIN_DIR . '/build';

		register_block_type_from_metadata( $base_dir . '/cta' );
		register_block_type_from_metadata( $base_dir . '/testimonial' );
		register_block_type_from_metadata(
			$base_dir . '/post-list',
			[
				'render_callback' => [ 'WP_Multi_Blocks_Post_List_Render', 'render' ],
			]
		);
	}
}

