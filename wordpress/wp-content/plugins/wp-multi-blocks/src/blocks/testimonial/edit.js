import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

const Edit = ( { attributes, setAttributes } ) => {
	const { quote, author, role } = attributes;
	const blockProps = useBlockProps( {
		className: 'wp-multi-blocks-testimonial',
	} );

	return (
		<figure { ...blockProps }>
			<RichText
				tagName="blockquote"
				value={ quote }
				onChange={ ( value ) => setAttributes( { quote: value } ) }
				placeholder={ __( 'Escribe la cita del testimonio…', 'wp-multi-blocks' ) }
			/>
			<figcaption className="wp-multi-blocks-testimonial__meta">
				<RichText
					tagName="span"
					className="wp-multi-blocks-testimonial__author"
					value={ author }
					onChange={ ( value ) => setAttributes( { author: value } ) }
					placeholder={ __( 'Nombre de la persona', 'wp-multi-blocks' ) }
				/>
				<RichText
					tagName="span"
					className="wp-multi-blocks-testimonial__role"
					value={ role }
					onChange={ ( value ) => setAttributes( { role: value } ) }
					placeholder={ __( 'Cargo o rol', 'wp-multi-blocks' ) }
				/>
			</figcaption>
		</figure>
	);
};

export default Edit;

