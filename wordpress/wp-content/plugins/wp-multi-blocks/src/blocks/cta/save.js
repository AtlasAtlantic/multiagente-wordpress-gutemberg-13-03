import { useBlockProps, RichText } from '@wordpress/block-editor';

const Save = ( { attributes } ) => {
	const { heading, text, buttonText, buttonUrl } = attributes;
	const blockProps = useBlockProps.save( {
		className: 'wp-multi-blocks-cta',
		role: 'region',
	} );

	return (
		<section { ...blockProps }>
			{ heading && (
				<RichText.Content tagName="h2" value={ heading } />
			) }
			{ text && <RichText.Content tagName="p" value={ text } /> }
			{ buttonText && (
				<a
					className="wp-multi-blocks-cta__button"
					href={ buttonUrl || '#' }
				>
					{ buttonText }
				</a>
			) }
		</section>
	);
};

export default Save;

