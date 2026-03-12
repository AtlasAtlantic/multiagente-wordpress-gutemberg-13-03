import { useBlockProps, RichText } from '@wordpress/block-editor';

const Save = ( { attributes } ) => {
	const { quote, author, role } = attributes;
	const blockProps = useBlockProps.save( {
		className: 'wp-multi-blocks-testimonial',
	} );

	return (
		<figure { ...blockProps }>
			{ quote && (
				<RichText.Content tagName="blockquote" value={ quote } />
			) }
			<figcaption className="wp-multi-blocks-testimonial__meta">
				{ author && (
					<RichText.Content
						tagName="span"
						className="wp-multi-blocks-testimonial__author"
						value={ author }
					/>
				) }
				{ role && (
					<RichText.Content
						tagName="span"
						className="wp-multi-blocks-testimonial__role"
						value={ role }
					/>
				) }
			</figcaption>
		</figure>
	);
};

export default Save;

