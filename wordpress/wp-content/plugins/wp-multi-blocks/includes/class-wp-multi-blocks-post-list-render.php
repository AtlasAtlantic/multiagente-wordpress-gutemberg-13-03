<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WP_Multi_Blocks_Post_List_Render {
	public static function render( array $attributes, string $content ): string {
		$defaults = [
			'postsPerPage'   => 5,
			'postType'       => 'post',
			'order'          => 'DESC',
			'orderBy'        => 'date',
			'displayExcerpt' => true,
			'displayDate'    => true,
			'displayAuthor'  => false,
			'noResultsText'  => __( 'No se han encontrado entradas.', 'wp-multi-blocks' ),
		];

		$attributes = wp_parse_args( $attributes, $defaults );

		$query_args = [
			'post_type'      => sanitize_key( $attributes['postType'] ),
			'posts_per_page' => absint( $attributes['postsPerPage'] ),
			'order'          => in_array( strtoupper( $attributes['order'] ), [ 'ASC', 'DESC' ], true ) ? strtoupper( $attributes['order'] ) : 'DESC',
			'orderby'        => sanitize_key( $attributes['orderBy'] ),
		];

		$query = new WP_Query( $query_args );

		if ( ! $query->have_posts() ) {
			return '<div class="wp-multi-blocks-post-list wp-multi-blocks-post-list--empty">' . esc_html( $attributes['noResultsText'] ) . '</div>';
		}

		$section_aria_label = esc_attr__( 'Lista de entradas', 'wp-multi-blocks' );

		ob_start();
		?>
		<section class="wp-multi-blocks-post-list" aria-label="<?php echo $section_aria_label; ?>">
			<ul class="wp-multi-blocks-post-list__items">
				<?php
				while ( $query->have_posts() ) :
					$query->the_post();
					?>
					<li class="wp-multi-blocks-post-list__item">
						<article class="wp-multi-blocks-post-list__article" aria-labelledby="post-<?php the_ID(); ?>-title">
							<h3 id="post-<?php the_ID(); ?>-title" class="wp-multi-blocks-post-list__title">
								<a href="<?php the_permalink(); ?>" class="wp-multi-blocks-post-list__link">
									<?php the_title(); ?>
								</a>
							</h3>
							<?php if ( ! empty( $attributes['displayDate'] ) ) : ?>
								<time class="wp-multi-blocks-post-list__date" datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>">
									<?php echo esc_html( get_the_date() ); ?>
								</time>
							<?php endif; ?>
							<?php if ( ! empty( $attributes['displayAuthor'] ) ) : ?>
								<span class="wp-multi-blocks-post-list__author">
									<?php echo esc_html( get_the_author() ); ?>
								</span>
							<?php endif; ?>
							<?php if ( ! empty( $attributes['displayExcerpt'] ) ) : ?>
								<div class="wp-multi-blocks-post-list__excerpt">
									<?php echo wp_kses_post( get_the_excerpt() ); ?>
								</div>
							<?php endif; ?>
						</article>
					</li>
					<?php
				endwhile;
				wp_reset_postdata();
				?>
			</ul>
		</section>
		<?php

		return (string) ob_get_clean();
	}
}

